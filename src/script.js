const buyButtons = document.querySelectorAll('.buy-button');

buyButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const packageCard = button.parentElement;
        const packageName = packageCard.getAttribute('data-package-name');
        
        const userPhoneNumberInput = packageCard.querySelector('.data-number-input');
        const userEmailInput = packageCard.querySelector('.user-email-input');
        const userPaymentNumberInput = packageCard.querySelector('.payment-number-input');

        const userPhoneNumber = userPhoneNumberInput.value;
        const userEmail = userEmailInput.value;
        const userPaymentNumber = userPaymentNumberInput.value;

        if (!userPhoneNumber || !userEmail || !userPaymentNumber) {
            alert('Please fill in all the details to proceed.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    packageName,
                    userPhoneNumber,
                    userEmail,
                    userPaymentNumber
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                console.log('Payment Link:', data.paymentLink);
            } else {
                alert(`Error: ${data.message}`);
            }

        } catch (error) {
            console.error('Fetch error:', error);
            alert('Failed to connect to the server. Please try again later.');
        }
    });
});