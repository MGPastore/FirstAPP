
const urlParams = new URLSearchParams(window.location.search);
const formId = urlParams.get('formId');
const userId = urlParams.get('userId');

async function sendData(data,formId) {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  var uriPost = "https://question-pg7v.onrender.com/POST/" + formId + "/Response"
  fetch(uriPost, config)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud.');
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta exitosa:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });


}
const uriGet = "https://question-pg7v.onrender.com/GET/Question/"+userId;
fetch(uriGet)
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
    button.addEventListener("click", async (e) => {
      e.preventDefault()
      //alert("Elmassii paso por aca :3")
      const inputs = document.querySelectorAll("input[type='text']");

      const formData = [];

      inputs.forEach((input, index) => {
        formData.push({
          formId: formId,
          questionId: input.id, 
          answer: input.value,
        });
      });

      console.log(formData);

      // Llamar a sendData con formData
      await sendData(formData,formId);


    });
  })
  .catch((error) => {
    console.error("Ocurrió un error:", error);
  });
