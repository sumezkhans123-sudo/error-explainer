/* =========================
   GET HTML ELEMENTS
========================= */

const errorInput = document.getElementById("errorInput");

const explainButton = document.getElementById("explainButton");

const statusMessage = document.getElementById("statusMessage");

const resultSection = document.getElementById("resultSection");

const result = document.getElementById("result");

const copyButton = document.getElementById("copyButton");

const exampleButtons =
  document.querySelectorAll(".example-button");


/* =========================
   FORMAT AI RESPONSE
========================= */

function formatExplanation(text) {

  let formatted = text;

  /*
    Convert code blocks first.
  */

  formatted = formatted.replace(
    /```(?:javascript|js)?\s*([\s\S]*?)```/g,
    "<pre><code>$1</code></pre>"
  );


  /*
    Convert ### headings.
  */

  formatted = formatted.replace(
    /^### (.*)$/gm,
    "<h3>$1</h3>"
  );


  /*
    Convert bold text.
  */

  formatted = formatted.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );


  /*
    Convert numbered lists.
  */

  formatted = formatted.replace(
    /^(\d+)\.\s+(.*)$/gm,
    "<strong>$1.</strong> $2"
  );


  /*
    Convert line breaks.
  */

  formatted = formatted.replace(
    /\n/g,
    "<br>"
  );


  return formatted;
}


/* =========================
   EXAMPLE ERRORS
========================= */

exampleButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const exampleError =
      button.dataset.error;

    errorInput.value = exampleError;

    errorInput.focus();

    statusMessage.textContent =
      "Example loaded. Click Explain Error.";

  });

});


/* =========================
   EXPLAIN ERROR
========================= */

explainButton.addEventListener(
  "click",
  async () => {

    const error =
      errorInput.value.trim();


    /*
      Validate input.
    */

    if (!error) {

      statusMessage.textContent =
        "Please paste an error first.";

      errorInput.focus();

      return;
    }


    /*
      Loading state.
    */

    explainButton.disabled = true;

    explainButton.textContent =
      "Explaining...";

    statusMessage.textContent =
      "AI is analyzing your error...";

    resultSection.classList.add(
      "hidden"
    );


    try {

      /*
        Send error to backend.
      */

      const response = await fetch(
        "http://localhost:3000/generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            error: error
          })
        }
      );


      /*
        Convert response to JSON.
      */

      const data =
        await response.json();


      /*
        Handle backend errors.
      */

      if (!response.ok) {

        throw new Error(
          data.error ||
          "Something went wrong."
        );

      }


      /*
        Display formatted AI response.
      */

      result.innerHTML =
        formatExplanation(
          data.explanation
        );


      /*
        Show result section.
      */

      resultSection.classList.remove(
        "hidden"
      );


      statusMessage.textContent =
        "Explanation generated successfully.";


    } catch (error) {

      console.error(error);

      statusMessage.textContent =
        error.message ||
        "Unable to connect to the backend.";

    } finally {

      /*
        Restore button.
      */

      explainButton.disabled = false;

      explainButton.textContent =
        "Explain Error";

    }

  }
);


/* =========================
   COPY RESULT
========================= */

copyButton.addEventListener(
  "click",
  async () => {

    const text =
      result.innerText.trim();


    if (!text) {
      return;
    }


    try {

      await navigator.clipboard.writeText(
        text
      );

      copyButton.textContent =
        "Copied!";


      setTimeout(() => {

        copyButton.textContent =
          "Copy";

      }, 1500);


    } catch (error) {

      console.error(
        "Copy failed:",
        error
      );

      copyButton.textContent =
        "Copy failed";

    }

  }
);