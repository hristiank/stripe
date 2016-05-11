<script src="https://code.jquery.com/jquery-2.2.0.min.js"></script>
<script src="https://rawgit.com/lodash/lodash/4.12.0/dist/lodash.min.js"></script>
<script src="https://checkout.stripe.com/checkout.js"></script>

<script>
    var buttons = '#lp-pom-button-ID1, #lp-pom-button-ID2';
    var data = [
        {
            id: 'lp-pom-button-ID1',
            price: 299, //Price is in whole dollars here. The script would convert it to cents automatically.
            name: 'NAME_OF_YOUR_FIRST_PRODUCT',
            desc: 'DESCRIPTION_OF_YOUR_FIRST_PRODUCT'
        }, {
            id: 'lp-pom-button-ID2',
            price: 499,
            name: 'NAME_OF_YOUR_SECOND_PRODUCT',
            desc: 'DESCRIPTION_OF_YOUR_SECOND_PRODUCT'
        }
    ];

    $(buttons).click(function() {
        var id = $(this).attr('id');
        var x = _.find(data, function(i) { return i.id == id });
        initStripe(x);
    });

    function initStripe(data) {
        var handler = StripeCheckout.configure({
            key: 'YOUR_OWN_STRIPE_PUBLIC_KEY',
            image: 'ICON_IMAGE',
            allowRememberMe: 'false',
            currency: 'USD',
//            zipCode: 'true',
//            locale: 'auto',
            token: function(token) {
                console.log('token', token)
                $.ajax({
                    url: 'URL_TO_YOUR_BACKEND',
                    type: 'POST',
                    crossDomain: true,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify({
                        amount: data.price * 100,
                        source: token.id,
                        receipt_email: token.email
                    }),
                    success: function() { location.href = 'http://revise.cc/yes/'},
                    error: function() { location.href = 'http://revise.cc/no/'} }); }
        });

        handler.open({
            name: data.name,
            description: data.desc || '',
            amount: data.price * 100
        });

        $(window).on('popstate', function() {
            handler.close();
        });
    }
</script>