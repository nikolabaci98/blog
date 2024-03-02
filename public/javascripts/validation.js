document.getElementById('composeForm').addEventListener('submit', (event) => {
    // Prevent the default form submission
    console.log("VALIDATION PART");

    event.preventDefault();

    // Validate the input
    var blogTitle = document.getElementById('blogTitle').value;
    var text = document.getElementById('blogPost').value;

    if (blogTitle.length >= 3 && text.length >= 3) {
      // Submit the form if validation passes
      event.target.submit();
    } else {
      // Display an error message or perform any other action
      alert("Input must be at least 3 characters long.");
    }
  });
