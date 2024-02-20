document.getElementById('composeForm').addEventListener('submit', function(event) {
    // Prevent the default form submission
    console.log("VALIDATION PART");

    event.preventDefault();

    // Validate the input
    var authorName = document.getElementById('authorName').value;
    var text = document.getElementById('blogPost').value;

    if (authorName.length >= 3 && text.length >= 3) {
      // Submit the form if validation passes
      this.submit();
    } else {
      // Display an error message or perform any other action
      alert("Input must be at least 3 characters long.");
    }
  });