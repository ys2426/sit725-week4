$(document).ready(function(){
    // Initialize modal
    $('.modal').modal();

    // Click event for "click me" button
    $('#clickMe').click(function() {
        $('#modal1').modal('open');
    });

    // Form submission handler
    $('#card-form').submit(function(event) {
        event.preventDefault();

        // Get form data
        const formData = $(this).serializeArray();

        // Convert form data to object
        const cardData = {};
        formData.forEach(function(field) {
            cardData[field.name] = field.value;
        });

        // Submit card data to server
        $.post('/api/cards', cardData)
            .done(function(response) {
                console.log(response);
                M.toast({html: 'Card added successfully', classes: 'rounded green'});
                $('#card-form')[0].reset(); // Reset form
            })
            .fail(function(err) {
                console.error('Error adding card:', err);
                M.toast({html: 'Failed to add card', classes: 'rounded red'});
            });
    });

    // Fetch and display cards
    function fetchCards() {
        $.get('/api/cards')
            .done(function(cards) {
                console.log(cards);
                $('#card-section').empty(); // Clear existing cards
                cards.forEach(function(card) {
                    const cardHtml = `
                        <div class="card">
                            <div class="card-image">
                                <img src="${card.image}" alt="${card.title}">
                                <span class="card-title">${card.title}</span>
                            </div>
                            <div class="card-content">
                                <p>${card.description}</p>
                            </div>
                            <div class="card-action">
                                <a href="${card.link}" target="_blank">Learn More</a>
                            </div>
                        </div>
                    `;
                    $('#card-section').append(cardHtml); // Append card HTML
                });
            })
            .fail(function(err) {
                console.error('Error fetching cards:', err);
            });
    }

    fetchCards(); // Fetch cards when page loads

    $('#delete-all-cards').click(function() {
        if (confirm('Are you sure you want to delete all cards?')) {
            $.ajax({
                url: '/api/cards',
                type: 'DELETE',
                success: function(response) {
                    console.log(response);
                    M.toast({html: 'All cards deleted successfully!', classes: 'rounded green'});
                    fetchCards(); // Refresh the list after deleting all
                },
                error: function(err) {
                    console.error('Error deleting all cards:', err);
                    M.toast({html: 'Failed to delete all cards', classes: 'rounded red'});
                }
            });
        }
    });
    
});