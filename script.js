document.addEventListener('DOMContentLoaded', function() {

    // --- Data for Services ---
    const services = [
        { name: 'Dry Cleaning', price: 200.00 },
        { name: 'Wash & Fold', price: 100.00 },
        { name: 'Ironing', price: 30.00 },
        { name: 'Stain Removal', price: 500.00 },
        { name: 'Leather & Suede Cleaning', price: 999.00 },
        { name: 'Wedding Dress Cleaning', price: 2800.00 }
    ];

    // --- Cart State ---
    let cart = [];

    // --- Get Elements ---
    const serviceItemsContainer = document.getElementById('service-items');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountSpan = document.getElementById('total-amount');
    const bookingForm = document.getElementById('booking-form-details');
    const confirmationMessage = document.getElementById('confirmation-message');
    const bookBtn = document.getElementById('book-service-btn');
    const bookingSection = document.getElementById('booking-section');

    // --- Function to Render Services ---
    function renderServices() {
        // Clear it first in case of any issues
        serviceItemsContainer.innerHTML = ''; 
        
        services.forEach((service, index) => {
            const item = document.createElement('div');
            item.className = 'service-item';
            item.innerHTML = `
                <span>${service.name} - ₹${service.price.toFixed(2)}</span>
                <div>
                    <button class="add-btn" data-index="${index}">Add Item</button>
                    <button class="remove-btn" data-index="${index}">Remove Item</button>
                </div>
            `;
            serviceItemsContainer.appendChild(item);
        });
    }

    // --- Function to Render Cart ---
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
             // You can add a placeholder row here if you want
        } else {
            cart.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>₹${item.price.toFixed(2)}</td>
                `;
                cartItemsContainer.appendChild(row);
                total += item.price;
            });
        }
        totalAmountSpan.textContent = total.toFixed(2);
    }

    // --- Event Listeners for Add/Remove Buttons ---
    serviceItemsContainer.addEventListener('click', function(e) {
        const index = e.target.getAttribute('data-index');
        if (index === null) return; // Didn't click a button

        const selectedService = services[index];
        
        const buttonContainer = e.target.parentElement;
        const addButton = buttonContainer.querySelector('.add-btn');
        const removeButton = buttonContainer.querySelector('.remove-btn');

        if (e.target.classList.contains('add-btn')) {
            cart.push(selectedService);
            addButton.style.display = 'none';
            removeButton.style.display = 'inline-block'; 

        } else if (e.target.classList.contains('remove-btn')) {
            const cartIndex = cart.findIndex(item => item.name === selectedService.name);
            if (cartIndex > -1) {
                cart.splice(cartIndex, 1);
            }
            removeButton.style.display = 'none';
            addButton.style.display = 'inline-block';
        }
        
        renderCart();
    });
    
    // --- Hero Section Button Scroll ---
    if (bookBtn && bookingSection) {
        bookBtn.addEventListener('click', () => {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Email.js Integration ---
    (function() {
        emailjs.init('jG_WnTcUmg_PC4Uc7'); // Your Email.js User ID
    })();

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const templateParams = {
                from_name: document.getElementById('full-name').value,
                from_email: document.getElementById('email-id').value,
                phone_number: document.getElementById('phone-number').value,
                services: cart.map(item => `${item.name} (₹${item.price.toFixed(2)})`).join(', '),
                total_amount: totalAmountSpan.textContent
            };

            emailjs.send('service_wnt0rbg', 'template_y12q7sh', templateParams)
                .then(function(response) {
                   console.log('SUCCESS!', response.status, response.text);
                   if (confirmationMessage) confirmationMessage.style.display = 'block';
                   bookingForm.reset();
                   cart = [];
                   renderCart();
                   // After submitting, we also need to reset all service buttons to "Add Item"
                   document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = 'none');
                   document.querySelectorAll('.add-btn').forEach(btn => btn.style.display = 'inline-block');
                }, function(error) {
                   console.log('FAILED...', error);
                   alert('Failed to send booking. Please try again.');
                });
        });
    }

    // --- Initial Render ---
    // These two function calls are what make your items appear!
    renderServices();
    renderCart();
});
