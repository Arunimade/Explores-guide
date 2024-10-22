const blogForm = document.getElementById('blog-form');
const blogsList = document.getElementById('blogs');

// Handle form submission
blogForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = document.getElementById('blog-title').value;
  const content = document.getElementById('blog-content').value;

  try {
    const response = await fetch('http://localhost:5000/add-blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });

    if (response.ok) {
      alert('Blog posted successfully!');
      fetchBlogs(); // Refresh the blog list
      blogForm.reset();
    } else {
      const errorMessage = await response.text();
      alert(`Error posting blog: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Fetch and display all blogs
async function fetchBlogs() {
  try {
    const response = await fetch('http://localhost:5000/blogs');
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const blogs = await response.json();
    blogsList.innerHTML = ''; // Clear the list before populating

    blogs.forEach(blog => {
      const li = document.createElement('li');

      // Create a clickable link for each blog title
      const link = document.createElement('a');
      link.textContent = `${blog.title} - ${new Date(blog.date).toLocaleString()}`;
      link.href = `http://localhost:5000/blog/${blog.id}`; // Ensure the backend returns correct blog IDs
      link.target = '_blank'; // Open in a new tab

      li.appendChild(link);
      blogsList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
}

// Fetch blogs on page load
fetchBlogs();
