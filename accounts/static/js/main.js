document.addEventListener('DOMContentLoaded', () => {
    // Shared Functions
    const showAlert = (id, message, type) => {
        const alertEl = document.getElementById(id);
        if (!alertEl) return;
        alertEl.textContent = message;
        alertEl.className = `alert ${type}`;
        alertEl.style.display = 'block';
    };

    const hideAlert = (id) => {
        const alertEl = document.getElementById(id);
        if (!alertEl) return;
        alertEl.className = 'alert hidden';
        alertEl.style.display = 'none';
        alertEl.textContent = '';
    };

    const clearErrors = (formId) => {
        const form = document.getElementById(formId);
        if (!form) return;
        const errorSpans = form.querySelectorAll('.error-msg');
        errorSpans.forEach(span => span.textContent = '');
    };

    const setError = (inputId, message) => {
        const errSpan = document.getElementById(`err-${inputId}`);
        if (errSpan) {
            errSpan.textContent = message;
        }
    };

    // Signup Form Validation & Submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors('signup-form');
            hideAlert('signup-alert');

            let isValid = true;
            const data = {
                first_name: signupForm.first_name.value.trim(),
                last_name: signupForm.last_name.value.trim(),
                email: signupForm.email.value.trim(),
                age: signupForm.age.value,
                gender: signupForm.gender.value,
                dob: signupForm.dob.value,
                password: signupForm.password.value
            };

            // Validations
            if (!data.first_name) { setError('firstName', 'Required'); isValid = false; }
            if (!data.last_name) { setError('lastName', 'Required'); isValid = false; }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.email || !emailRegex.test(data.email)) {
                setError('email', 'Valid email required');
                isValid = false;
            }

            if (!data.age || parseInt(data.age) < 1) {
                setError('age', 'Must be valid age > 0');
                isValid = false;
            }

            if (!data.gender) { setError('gender', 'Required'); isValid = false; }

            if (!data.dob) {
                setError('dob', 'Required');
                isValid = false;
            } else {
                const dobDate = new Date(data.dob);
                if (dobDate >= new Date()) {
                    setError('dob', 'Date must be in the past');
                    isValid = false;
                }
            }

            // Password rules: >8 chars, at least 1 letter, 1 number
            const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!data.password || !pwdRegex.test(data.password)) {
                setError('password', 'Requires ≥ 8 chars, 1 letter, 1 number');
                isValid = false;
            }

            if (!isValid) return;

            // API Call
            try {
                const response = await fetch('/api/signup/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert('signup-alert', 'Signup successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '/login/';
                    }, 1500);
                } else {
                    showAlert('signup-alert', result.error || 'Signup failed', 'error');
                }
            } catch (err) {
                showAlert('signup-alert', 'Network error occurred', 'error');
            }
        });
    }

    // Login Form Validation & Submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors('login-form');
            hideAlert('login-alert');

            let isValid = true;
            const data = {
                email: loginForm.email.value.trim(),
                password: loginForm.password.value
            };

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.email || !emailRegex.test(data.email)) {
                setError('email', 'Valid email required');
                isValid = false;
            }

            if (!data.password) {
                setError('password', 'Required');
                isValid = false;
            }

            if (!isValid) return;

            try {
                const response = await fetch('/api/login/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert('login-alert', 'Login successful! Intercom connecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '/home/';
                    }, 1000);
                } else {
                    showAlert('login-alert', result.error || 'Invalid credentials', 'error');
                }
            } catch (err) {
                showAlert('login-alert', 'Network error occurred', 'error');
            }
        });
    }

    // Forgot Password Form Validation & Submission
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors('forgot-form');
            hideAlert('forgot-alert');

            const email = forgotForm.email.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email || !emailRegex.test(email)) {
                setError('email', 'Valid email required');
                return;
            }

            // Show loading state
            const submitBtn = forgotForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/auth/forgot-password/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert('forgot-alert', result.message || 'Reset link sent to your email', 'success');
                    forgotForm.reset();
                } else {
                    showAlert('forgot-alert', result.error || 'Failed to send reset link', 'error');
                }
            } catch (err) {
                showAlert('forgot-alert', 'Network error occurred', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Reset Password Form Validation & Submission
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors('reset-form');
            hideAlert('reset-alert');

            let isValid = true;
            const password = resetForm.password.value;
            const confirmPassword = resetForm.confirm_password.value;
            const token = resetForm.getAttribute('data-token');

            const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!password || !pwdRegex.test(password)) {
                setError('password', 'Requires ≥ 8 chars, 1 letter, 1 number');
                isValid = false;
            }

            if (password !== confirmPassword) {
                setError('confirm_password', 'Passwords must match');
                isValid = false;
            }

            if (!isValid) return;

            const submitBtn = resetForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Updating...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`/api/auth/reset-password/${token}/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert('reset-alert', 'Password reset successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '/login/';
                    }, 1500);
                } else {
                    showAlert('reset-alert', result.error || 'Failed to reset password', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (err) {
                showAlert('reset-alert', 'Network error occurred', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Load Profile Data
    const profileContainer = document.getElementById('profile-container');
    if (profileContainer) {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/profile/');
                const data = await response.json();

                if (response.ok && data.profile) {
                    const profile = data.profile;
                    profileContainer.innerHTML = `
                        <div class="profile-detail">
                            <span class="profile-label">First Name:</span>
                            <span class="profile-value">${profile.first_name || '-'}</span>
                        </div>
                        <div class="profile-detail">
                            <span class="profile-label">Last Name:</span>
                            <span class="profile-value">${profile.last_name || '-'}</span>
                        </div>
                        <div class="profile-detail">
                            <span class="profile-label">Email:</span>
                            <span class="profile-value">${profile.email || '-'}</span>
                        </div>
                        <div class="profile-detail">
                            <span class="profile-label">Age:</span>
                            <span class="profile-value">${profile.age || '-'}</span>
                        </div>
                        <div class="profile-detail">
                            <span class="profile-label">Gender:</span>
                            <span class="profile-value">${profile.gender || '-'}</span>
                        </div>
                        <div class="profile-detail">
                            <span class="profile-label">Date of Birth:</span>
                            <span class="profile-value">${profile.dob || '-'}</span>
                        </div>
                    `;
                } else {
                    profileContainer.innerHTML = `<p style="color:var(--error); text-align:center;">Failed to load profile.</p>`;
                }
            } catch (err) {
                profileContainer.innerHTML = `<p style="color:var(--error); text-align:center;">Error loading profile.</p>`;
            }
        };
        fetchProfile();
    }

    // Load Reports History
    const reportsBody = document.getElementById('reports-body');
    if (reportsBody) {
        const fetchReports = async () => {
            try {
                const response = await fetch('/api/reports/');
                const data = await response.json();

                if (response.ok && data.reports) {
                    const reports = data.reports;
                    if (reports.length === 0) {
                        reportsBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No past predictions found.</td></tr>`;
                        return;
                    }

                    reportsBody.innerHTML = reports.map(r => {
                        const dateObj = new Date(r.timestamp);
                        const dateStr = !isNaN(dateObj) ? dateObj.toLocaleString() : '-';
                        let badgeClass = 'positive';
                        if (r.result && r.result.toLowerCase().includes('negative') || r.result && r.result.toLowerCase().includes('low risk')) {
                            badgeClass = 'negative';
                        }
                        return `
                            <tr>
                                <td>${dateStr}</td>
                                <td>${r.disease_type}</td>
                                <td><span class="badge ${badgeClass}">${r.result}</span></td>
                            </tr>
                        `;
                    }).join('');
                } else {
                    reportsBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--error);">Failed to load history.</td></tr>`;
                }
            } catch (err) {
                reportsBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--error);">Error loading history.</td></tr>`;
            }
        };
        fetchReports();
    }

    // Prediction Form
    const predictForm = document.getElementById('predict-form');
    if (predictForm) {
        predictForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideAlert('predict-alert');

            const disease = predictForm.getAttribute('data-disease');
            const submitBtn = predictForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Gather all inputs
            const formData = new FormData(predictForm);
            const data = Object.fromEntries(formData.entries());

            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`/api/predict/${disease}/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    let msgType = 'success';
                    if (result.result.toLowerCase().includes('positive') || result.result.toLowerCase().includes('detected')) {
                        msgType = 'error'; // Display bad news with error theme
                    }
                    showAlert('predict-alert', `Final Report: ${result.result}`, msgType);
                } else {
                    showAlert('predict-alert', result.error || 'Prediction failed', 'error');
                }
            } catch (err) {
                showAlert('predict-alert', 'Network error occurred', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
