declare var Razorpay: any;
const server = import.meta.env.VITE_SERVER;
export const paymentHandler = (e: any, amount: number): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const currency = "INR";
      const receiptId = "qere";

      const response = await fetch(`${server}/api/v1/payment/create`, {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency,
          receipt: receiptId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const orderResponse = await response.json();
      console.log(orderResponse);

      var options = {
        key: import.meta.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
        amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency,
        name: "Acme Corp",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: orderResponse.order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response: any) {
          try {
            const rzrpObject = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            console.log(rzrpObject);

            const validate = await fetch(
              `${server}/api/v1/payment/verification`,
              {
                method: "POST",
                body: JSON.stringify(rzrpObject),
                headers: { "Content-Type": "application/json" },
              }
            );

            const validateResponse = await validate.json();
            console.log(validateResponse);

            if (validateResponse.valid) {
              resolve(true);
            } else {
              reject(new Error("Signature validation failed"));
            }
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: "Navjyot Mishra",
          email: "navjyot.mishra@example.com",
          contact: "8900000890",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      let rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
        reject(new Error("Payment failed"));
      });
      rzp1.open();
      e.preventDefault();
    } catch (error) {
      reject(error);
    }
  });
};
