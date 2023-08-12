let burgerIconSide = document.querySelector(".sideMenuIcon")
let sider = document.querySelector(".sideBar")
burgerIconSide?.addEventListener('click', ()=>{
    sider.classList.toggle('active');
})

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const token = localStorage.getItem('token'); // Assuming you save the token in local storage
        
        // Get the current URL
        const currentUrl = window.location.pathname;

        // Define URLs that should be exempt from authentication check
        const exemptUrls = ['/login.html', '/register.html', '/index.html'];

        // Skip validation if on an exempt page
        if (!exemptUrls.includes(currentUrl)) {
            const response = await fetch('http://localhost:5000/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // Redirect to login page if token is not valid or expired
                window.location.href = '/login.html';
                return;
            }

            const data = await response.json();
            if (currentUrl.includes('/student') && data.type !== 'student') {
                // Redirect to student's home page
                window.location.href = '/student/index.html';
            } else if (currentUrl.includes('/admin') && data.type !== 'admin') {
                // Redirect to admin's home page
                window.location.href = '/admin/index.html';
            }
        }
    } catch (error) {
        console.error('Request error:', error);
    }


});




// ################################################ LOGOUT
// Select the logout button
let logoutBtn = document.getElementById("logout");

// Add a click event listener to the logout button
logoutBtn.addEventListener('click', async () => {
    try {
        // Clear the token from localStorage
        localStorage.removeItem('token');

        // Optionally, perform any other logout-related actions
        
        // Redirect the user to a login page or home page
        window.location.href = '/index.html'; // Replace with your desired URL
    } catch (error) {
        console.error('Logout error:', error);
    }
});
