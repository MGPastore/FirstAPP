const apiUrl = "https://question-pg7v.onrender.com/GET/Question/MGP";

fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("La solicitud no fue exitosa");
    }

    return response.json();
  })
  .then((data) => {
    console.log(data);

    const createForm = () => {
      const button = document.createElement("button");
      button.textContent = "Enviar";
      button.id = "button";

      const form = document.createElement("form");
      form.id = "myForm";

      for (let i = 0; i < data.length; i++) {
        const label = document.createElement("label");
        label.textContent = data[i].text;

        const input = document.createElement("input");
        input.id = data[i].id;
        console.log(input.id);
        input.type = "text";

        form.appendChild(label);
        form.appendChild(input);
      }

      form.appendChild(button);
      document.body.appendChild(form);
    };

    createForm();
  })
  .then(() => {
    const button = document.getElementById("button");
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const inputs = document.querySelectorAll("input[type='text']");

      const formData = {};

      inputs.forEach((input) => {
        formData[input.id] = input.value;
      });
      console.log(inputs);
      console.log(formData);
    });
  })
  .catch((error) => {
    console.error("Ocurrió un error:", error);
  });
