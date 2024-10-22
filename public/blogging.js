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
      alert('Error posting blog');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Fetch and display all blogs
async function fetchBlogs() {
  try {
    const response = await fetch('http://localhost:5000/blogs');
    const blogs = await response.json();
    
    blogsList.innerHTML = '';
    blogs.forEach(blog => {
      const li = document.createElement('li');
      li.textContent = `${blog.title} - ${new Date(blog.date).toLocaleString()}`;
      blogsList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
}

// Fetch blogs on page load
fetchBlogs();
