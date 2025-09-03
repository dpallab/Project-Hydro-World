(function () {
  emailjs.init("s0Y3gKFn5X62css55"); // Replace with your EmailJS Public Key
})();
document.addEventListener("DOMContentLoaded", function () {
// Auto update year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Handle contact form submission
const form = document.querySelector("form");

const statusMessage = document.querySelector("#statusmessage");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // stop page reload

  // Get values
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    alert("Please fill out all fields before submitting.");
    return;
  }

  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: "rahul_ds17",
      template_id: "template_kbia8fa",
      user_id: "s0Y3gKFn5X62css55", // Not private key
      template_params: {
        from_name: name,
        reply_to: email,
        message: message
      },
    }),
  })
    .then(() => {
      statusMessage.innerHTML = "✅ Message sent successfully!";
      statusMessage.style.color = "green";
      form.reset();
    })
    .catch(() => {
      statusMessage.innerHTML = "❌ Failed to send. Try again later.";
      statusMessage.style.color = "red";
    });

  // // Simulate sending
  // alert(
  //   `Thank you, ${name}! Your message has been received.\n\nWe’ll get back to you at ${email}.`
  // );

  // Reset form
  form.reset();
});
});
