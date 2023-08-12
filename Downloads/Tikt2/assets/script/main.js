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

        // Fetch user info using the userinfo endpoint
        const userInfoResponse = await fetch('http://localhost:5000/userinfo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (userInfoResponse.ok) {
            const userInfo = await userInfoResponse.json();

            // Redirect logged-in users away from login and register pages
            if ((currentUrl.includes('/login.html') || currentUrl.includes('/register.html')) && userInfo.username) {
                // Assuming that the presence of a username means the user is logged in
                if (userInfo.type === 'student') {
                    window.location.href = '/student/index.html'; // Change to the appropriate URL
                } else if (userInfo.type === 'admin') {
                    window.location.href = '/admin/index.html'; // Change to the appropriate URL
                }
                return;
            }

            // Continue with other authentication checks
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

                if (currentUrl.includes('/admin') && userInfo.type !== 'admin') {
                    // Redirect to student's home page
                    window.location.href = '/student/index.html';
                } else if (currentUrl.includes('/student') && userInfo.type !== 'student') {
                    // Redirect to admin's home page
                    window.location.href = '/admin/index.html';
                }
            }
            
            // Update the first name element if it exists
            const userFirstNameElement = document.getElementById('userFirstName');
            if (userFirstNameElement) {
                userFirstNameElement.textContent = userInfo.username; // Assuming username is the first name
            }
        } else {
            console.error('Failed to fetch user info:', userInfoResponse.status);
        }
                document.body.classList.remove('hide-content');

    } catch (error) {
        console.error('Request error:', error);
    }
});


// Save Club Button

document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');

    saveButton.addEventListener('click', async function (event) {
        event.preventDefault();

        // Gather the club creation form data
        const clubName = document.querySelector('input[name="club_name"]').value;
        const clubTopic = document.querySelector('input[name="club_topic"]').value;
        const clubUniversity = document.querySelector('input[name="club_university"]').value;

        // Create a JSON object with the data
        const clubData = {
            club_name: clubName,
            club_topic: clubTopic,
            club_university: clubUniversity,
            admin_id:"2424"
            // You might need to include the admin_id here if you have it
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/create_club', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Attach the token in the request headers
                },
                body: JSON.stringify(clubData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data); // Handle the response data as needed
            } else {
                console.error('Request failed:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Request error:', error);
        }
    });
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
