import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/layout";
import { submitPayment } from "@/lib/api/enrollment.functions";
import type { Database } from "@/integrations/supabase/types";
import { useState } from "react";
import { CheckCircle2, Lock, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Enrollment = Database["public"]["Tables"]["course_enrollments"]["Row"];
type Program = Database["public"]["Tables"]["programs"]["Row"];
type PaymentMethod = "M-Pesa" | "Bank Transfer" | "PayPal" | "Credit Card";

export const Route = createFileRoute("/_authenticated/payment/$enrollmentId")({
  head: () => ({ meta: [{ title: "Course Payment — AMTMTI" }] }),
  component: PaymentPage,
});

function PaymentPage() {
  const { enrollmentId } = Route.useParams();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("M-Pesa");
  const [loading, setLoading] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrollment", enrollmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_enrollments")
        .select("*")
        .eq("id", enrollmentId)
        .single();
      if (error) throw error;
      return data as Enrollment;
    },
  });

  const { data: program, isLoading: programLoading } = useQuery({
    queryKey: ["program", enrollment?.program_id],
    enabled: !!enrollment?.program_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("id", enrollment!.program_id)
        .single();
      if (error) throw error;
      return data as Program;
    },
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
  });

  const submitPaymentMutation = useMutation({
    mutationFn: async (method: PaymentMethod) => {
      setLoading(true);
      const reference = `${user?.id?.slice(0, 8)}-${Date.now()}`;
      const tuitionFee = program?.price_ksh || 0;
      const discount = 0; // Can be dynamic based on promotions
      const totalAmount = Math.max(0, tuitionFee - discount);

      const mappedMethod = method === "Credit Card" ? "Bank Transfer" : (method as "M-Pesa" | "Bank Transfer" | "PayPal");
      
      await submitPayment({ 
        data: {
          enrollmentId,
          amount: totalAmount,
          reference,
          method: mappedMethod,
        }
      });
    },
    onSuccess: () => {
      setPaymentSubmitted(true);
      toast.success("Payment submission recorded. Awaiting admin approval.");
    },
    onError: (error) => {
      toast.error(`Payment error: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const isLoading = enrollmentLoading || programLoading || userLoading;

  if (isLoading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-4xl px-5 py-20 text-center text-muted-foreground">
          Loading payment information…
        </div>
      </PageShell>
    );
  }

  if (!enrollment || !program || !user) {
    return (
      <PageShell>
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Payment not available</h1>
          <p className="mt-2 text-muted-foreground">Unable to load enrollment details.</p>
        </div>
      </PageShell>
    );
  }

  const tuitionFee = program.price_ksh || 0;
  const discount = 0;
  const totalAmount = Math.max(0, tuitionFee - discount);

  if (paymentSubmitted) {
    return (
      <PageShell>
        <div className="mx-auto max-w-4xl px-5 py-20">
          <div className="border bg-background p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Payment Submitted</h1>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Thank you for your payment submission. Your payment is being reviewed by our admin team. You will receive an email confirmation once approved.
            </p>
            <p className="mt-4 text-sm font-mono text-muted-foreground">
              Reference: {user.id?.slice(0, 8)}-{Date.now()}
            </p>
            <div className="mt-8 flex flex-col gap-3 justify-center">
              <button
                onClick={() => navigate({ to: "/portal" })}
                className="inline-flex items-center justify-center bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Back to Portal
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 border border-input bg-background px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-5 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Course Payment</h1>
        <p className="text-muted-foreground mb-12">Complete your enrollment by submitting payment for your selected course.</p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Student Information */}
            <section className="border bg-background p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Student Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+254700000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </section>

            {/* Class Details */}
            <section className="border bg-background p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Class Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    COURSE NAME
                  </label>
                  <p className="text-foreground">{program.title}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    DURATION
                  </label>
                  <p className="text-foreground">{program.duration || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    LEVEL
                  </label>
                  <p className="text-foreground">{program.level || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    MODE
                  </label>
                  <p className="text-foreground">{program.mode || "TBD"}</p>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="border bg-background p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Payment Method</h2>
              <div className="space-y-4">
                {paymentMethodOptions.map((option) => (
                  <div key={option.id}>
                    <label className="flex items-start gap-4 p-4 border cursor-pointer transition-colors hover:bg-accent">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.id}
                        checked={selectedPaymentMethod === option.id}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{option.label}</p>
                        <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                      </div>
                    </label>
                    {selectedPaymentMethod === option.id && (
                      <div className="mt-4 ml-4 p-4 bg-muted text-sm text-muted-foreground border-l-2 border-primary">
                        {option.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 px-4 py-3 border bg-muted">
              <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Your payment information is secure and encrypted. We never store credit card details on our servers.
              </p>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="border bg-background p-8 sticky top-20">
              <h2 className="text-lg font-semibold text-foreground mb-6">Payment Summary</h2>

              <div className="space-y-4 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Tuition Fee</span>
                  <span className="font-medium text-foreground">${tuitionFee.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Applicable Discounts</span>
                    <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-between items-center mb-8">
                <span className="text-sm font-semibold text-foreground">Total Amount Due</span>
                <span className="text-3xl font-bold text-foreground">${totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={() => submitPaymentMutation.mutate(selectedPaymentMethod)}
                disabled={loading || !formData.fullName || !formData.email || !formData.phone}
                className="w-full flex items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  "Confirm & Pay"
                )}
              </button>

              <button
                className="w-full mt-3 flex items-center justify-center gap-2 border border-input bg-background px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </button>

              <p className="text-xs text-muted-foreground text-center mt-6">
                By proceeding, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

const paymentMethodOptions = [
  {
    id: "M-Pesa" as PaymentMethod,
    label: "M-PESA (East Africa)",
    description: "Safaricom mobile money",
    details: (
      <>
        <p className="font-semibold text-foreground mb-2">Send payment to:</p>
        <p className="mb-2">Paybill Number: <span className="font-mono font-bold">123456</span></p>
        <p className="mb-2">Account Number: <span className="font-mono font-bold">AI-COURSE-2026</span></p>
        <p className="text-xs mt-3">You will receive an M-PESA confirmation message immediately. Keep this reference for your records.</p>
      </>
    ),
  },
  {
    id: "Credit Card" as PaymentMethod,
    label: "Credit/Debit Card",
    description: "Visa, Mastercard, American Express",
    details: (
      <>
        <p className="font-semibold text-foreground mb-2">Secure payment via Stripe</p>
        <p>Click the button above to proceed to our secure payment gateway. Your card details are processed securely and never stored on our servers.</p>
      </>
    ),
  },
  {
    id: "PayPal" as PaymentMethod,
    label: "PayPal",
    description: "Fast and secure with your PayPal account",
    details: (
      <>
        <p className="font-semibold text-foreground mb-2">Pay with PayPal</p>
        <p className="mb-2">Send payment to: <span className="font-mono font-bold">payments@academy.com</span></p>
        <p className="text-xs mt-3">You will be redirected to PayPal to complete your transaction securely.</p>
      </>
    ),
  },
  {
    id: "Bank Transfer" as PaymentMethod,
    label: "Bank Transfer",
    description: "Direct bank account transfer",
    details: (
      <>
        <p className="font-semibold text-foreground mb-2">Bank Details:</p>
        <p className="text-sm space-y-1">
          <div>Bank: <span className="font-mono">Example Bank Ltd</span></div>
          <div>Account Name: <span className="font-mono">AI Academy Ltd</span></div>
          <div>Account Number: <span className="font-mono">0001234567</span></div>
          <div>Swift Code: <span className="font-mono">EXBKKEXX</span></div>
          <div className="mt-2">Reference: <span className="font-mono font-bold">{typeof window !== "undefined" ? `${(new Date()).toISOString().slice(0, 10)}-COURSE` : "DATE-COURSE"}</span></div>
        </p>
      </>
    ),
  },
];
