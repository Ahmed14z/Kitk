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
        const userInfoResponse = await fetch('http://localhost:8001/userinfo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userInfoResponse.ok && !currentUrl.includes('/login') ) {
            // Redirect to login page if user info cannot be fetched (user not logged in)
            window.location.href = '/login.html';
            return;
        }
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
                const response = await fetch('http://localhost:8001/validate', {
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
                    return; // Prevent non-admin users from accessing the admin page
                } else if (currentUrl.includes('/student') && userInfo.type !== 'student') {
                    // Redirect to admin's home page
                    window.location.href = '/admin/index.html';
                    return; // Prevent non-student users from accessing the student page
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
    const clubNameInput = document.querySelector('input[name="club_name"]');
    const clubTopicInput = document.querySelector('input[name="club_topic"]');
    const clubUniversityInput = document.querySelector('input[name="club_university"]');
    
    let isEditing = false; // Flag to track editing state
    
    saveButton.addEventListener('click', async function (event) {
        event.preventDefault();

        if (!isEditing) {
            // Entering edit mode
            isEditing = true;
            saveButton.textContent = 'Save';
            clubNameInput.readOnly = false;
            clubTopicInput.readOnly = false;
            clubUniversityInput.readOnly = false;
        } else {
            // Save or update club info
            try {
                const token = localStorage.getItem('token');
                const userInfoResponse = await fetch('http://localhost:8001/userinfo', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (userInfoResponse.ok) {
                    const userInfo = await userInfoResponse.json();

                    const clubData = {
                        club_name: clubNameInput.value,
                        club_topic: clubTopicInput.value,
                        club_university: clubUniversityInput.value,
                        admin_id: userInfo.id
                    };

                    let requestUrl = 'http://localhost:8001/create_club';
                    let requestMethod = 'POST';
                    
                    // If editing, change the request URL and method for updating
                    if (isEditing) {
                        requestUrl = 'http://localhost:8001/update_club';
                        requestMethod = 'PUT';
                    }

                    const response = await fetch(requestUrl, {
                        method: requestMethod,
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(clubData)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // Handle success as needed
                        
                        // Exit edit mode
                        isEditing = false;
                        saveButton.textContent = 'Edit';
                        clubNameInput.readOnly = true;
                        clubTopicInput.readOnly = true;
                        clubUniversityInput.readOnly = true;
                    } else {
                        console.error('Request failed:', response.status, response.statusText);
                    }
                } else {
                    console.error('Failed to fetch user info:', userInfoResponse.status);
                }
            } catch (error) {
                console.error('Request error:', error);
            }
        }
    });
});


// // ################# members
// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const token = localStorage.getItem('token'); // Retrieve token from local storage

//         // Function to fetch and display club members
//         async function fetchAndDisplayMembers() {
//             const response = await fetch('http://localhost:8000/get_club_members/2424', {
//                 method: 'GET',
//                 mode: 'cors',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.members && data.members.length > 0) {
//                     const membersTableBody = document.getElementById('membersTableBody');
//                     membersTableBody.innerHTML = ''; // Clear existing table rows

//                     // Populate the table with members
//                     data.members.forEach(member => {
//                         const row = document.createElement('tr');
//                         row.innerHTML = `
//                             <td>${member.username}</td>
//                             <td>${member.email}</td>
//                         `;
//                         membersTableBody.appendChild(row);
//                     });
//                 }
//             } else {
//                 console.error('Request failed:', response.status, response.statusText);
//             }
//         }

//         // Initial fetch and display of members
//         await fetchAndDisplayMembers();
//     } catch (error) {
//         console.error('Request error:', error);
//     }
// });


// ... (other code from main.js) ...

document.addEventListener('DOMContentLoaded', function () {
    const newMemberButton = document.getElementById('memebrNew');
    const newMemberEmailInput = document.getElementById('newMemberEmail');
    const notFoundMessage = document.getElementById('no');
    const addedMessage = document.getElementById('yes');
    
    newMemberButton.addEventListener('click', async () => {
        const email = newMemberEmailInput.value;
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:8001/add_user_to_club', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ club_id: "2", user_email: email }) // Update 'club_id' and 'email'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.message === 'User added to the club successfully') {
                notFoundMessage.classList.add('is-hidden');
                addedMessage.classList.remove('is-hidden');
                fetchAndUpdateMembers(); // Fetch and update members after adding
            } else if (data.error) {
                notFoundMessage.classList.remove('is-hidden');
                addedMessage.classList.add('is-hidden');
            }
        } else {
            console.error('Request failed:', response.status, response.statusText);
        }
    });

    // ... (other code from main.js) ...
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
