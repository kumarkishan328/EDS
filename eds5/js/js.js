$(function() {
    var $supplyItems = [];
    var $courierItems = [];
    var $communicationItems = [];
    var $utilityItems = [];
    var $diningItems = [];
    var $active = '';
    var selectbox = false;
    var $child = '';
    var $activeMenu = '';
    var $heading = '';
    var $active = '';
    var $partner = '';
    var $partnerName = '';


    $.getJSON("data/dining.json", function(data) {
        $diningItems = data;
    });
    $.getJSON("data/communication.json", function(data) {
        $communicationItems = data;
    });
    $.getJSON("data/courier.json", function(data) {
        $courierItems = data;
    });
    $.getJSON("data/supply.json", function(data) {
        $supplyItems = data;
    });
    $.getJSON("data/utility.json", function(data) {
        $utilityItems = data;
    });

    function printData(d) {
        $add = $pin = '';
        if (d.Add1)
            $add += d.Add1;
        if (d.Add2)
            $add += ' ' + d.Add2;
        if (d.Add3)
            $add += ' ' + d.Add3;
        if (d.City && d.City != 'none')
            $add += ' ' + d.City;
        if (d.Pin)
            $pin = d.Pin;
        $child = '<li class="dt"><span class="nm heading">' + d.Name + '</span><span class="add">' + $add + '</span><span class="e-m mobid">' + $pin + '</span>';
        $child += '<img src="images/share.gif" style="height: 20px; width: 56px;" class="sharebutton"><!-- <a class="fav" href="#"><img src="images/add.gif" style="height: 22px; width: 118px;"></a> --></li>';
        return $child;
    }



    function xmlData(data) {
        $content = [];
        $content.length = 0;
        $.each(data, function(key1, data1) {
            switch ($active) {
                case 'supply':                    
                    $searchin = data1.City.toLowerCase();
                    if ($searchin.indexOf($.cookie('city')) >= 0) {
                        printData(data1);
                        $content.push($child);
                    }
                    break;

                case 'courier':
                    if ($.cookie('city') == data1.City.toLowerCase()) {
                        printData(data1);
                        $content.push($child);
                    }
                    break;

                case 'communication':
                    $searchin = data1.Add1.toLowerCase();
                    if ($searchin.indexOf($.cookie('city')) >= 0) {
                        printData(data1);
                        $content.push($child);
                    }
                    break;

                case 'utility':
                    printData(data1);
                    $content.push($child);
                    break;

                case 'dining':
                    $searchin = data1.Add1.toLowerCase();
                    if ($searchin.indexOf($.cookie('city')) >= 0) {
                        printData(data1);
                        $content.push($child);
                    }
                    break;

            }

        });
        $html = $content.join("");
        $(".data-filter").html('<ul>' + $html + '</ul><div class="clear"></div>');
    }

    $('.menu li img').click(function() {
        $('.menu_bar li img').removeClass('active');
        $(this).addClass('active');
        $('.homeitem').addClass('hidden');
        $('.inneritem').removeClass('hidden');
        $('.menu').addClass('menu_bar').removeClass('menu');
        $('.movie_home').addClass('movie_small').removeClass('movie_home');
        $('.city-div .display').text($.cookie('city'));
        $('.contain').css('height', 'auto');
        $('.input-filter').val('');

        /*
         * Change the data 
         */
        $rel = $(this).attr('rel');
        $aFilter = $('.a-filter').val();

        $activeMenu = $rel;

        switch ($rel) {
            case 'supply':
                $heading = 'Supermarkets & Office Supplies';
                $active = 'supply';
                $partner = 'office-partner';
                xmlData($supplyItems);
                break;

            case 'courier':
                $heading = 'Courier and Shipping';
                $active = 'courier';
                $partner = 'courier-partner';
                xmlData($courierItems);
                break;

            case 'communication':
                $heading = 'Communication';
                $active = 'communication';
                $partner = 'communication-partner';
                xmlData($communicationItems);
                break;

            case 'utility':
                $heading = 'Utility & Insurance';
                $active = 'utility';
                $partner = 'utilities-partner';
                xmlData($utilityItems);                
                break;

            case 'dining':
                $heading = 'Dining';
                $active = 'dining';
                $partner = 'dining-partner';
                xmlData($diningItems);
                break;
        }
        $partnerName = '';
        $('.list-unstyled').hide();
        $('#' + $partner).show();
        $(".header-filter").text($heading);
        if (!selectbox) {
            $('.a-filter').val($active);
        } else {
            selectbox = false;
        }

    });



    function getPartnerData(data, $partnerName) {
        $content = [];
        $content.length = 0;
        $outletFound = false;
        $.each(data, function(key1, data1) {
            $searchin = data1.Name.toLowerCase();
            if ($searchin.indexOf($partnerName) >= 0 && $active == 'utility') {
                printData(data1);
                $content.push($child);
                $outletFound = true;
            } else if ($searchin.indexOf($partnerName) >= 0 && $active == 'communication' ) {
                if (data1.Add1.toLowerCase().indexOf($.cookie('city')) >= 0  || data1.Add1.toLowerCase().indexOf('please visit the website all') >= 0 ) {
                    printData(data1);
                    $content.push($child);
                    $outletFound = true;
                }
            } else if ($searchin.indexOf($partnerName) >= 0 && $active == 'dining') {
                if (data1.Add1.toLowerCase().indexOf($.cookie('city')) >= 0) {
                    printData(data1);
                    $content.push($child);
                    $outletFound = true;
                }
            } else if ($searchin.indexOf($partnerName) >= 0 && $active == 'supply') {
                if (data1.City.toLowerCase().indexOf($.cookie('city')) >= 0) {
                    printData(data1);
                    $content.push($child);
                    $outletFound = true;
                }
            } else if ($searchin.indexOf($partnerName) >= 0 && $.cookie('city') == data1.City.toLowerCase()) {
                printData(data1);
                $content.push($child);
                $outletFound = true;
            }
        });
        if (!$outletFound)
            $content.push('<li class="dt"><span class="nm heading">No Store Found</span><span class="add">This partner is not available in your selected city. Please choose other city or partner.</span><div class="clear"></div></li>');
        $html = $content.join("");
        $(".data-filter").html('<ul>' + $html + '</ul><div class="clear"></div>');

    }
    $('.featured-partners a').click(function() {
        $partnerName = $(this).attr('rel').toLowerCase();
        
        switch ($activeMenu) {
            case 'supply':
                getPartnerData($supplyItems, $partnerName);
                break;

            case 'courier':
                getPartnerData($courierItems, $partnerName);
                break;

            case 'communication':
                getPartnerData($communicationItems, $partnerName);
                break;

            case 'utility':
                getPartnerData($utilityItems, $partnerName);
                break;

            case 'dining':
                getPartnerData($diningItems, $partnerName);
                break;
        }
        return false;
    });

    function getSearchData(data, $keyword) {
        $content = [];
        $content.length = 0;
        $partnerName = $keyword;
        $.each(data, function(key1, d) {
            $searchin = d.Name.toLowerCase() + ' ';
            if ($searchin.indexOf($partnerName) >= 0 && $active == 'utility') {
                printData(d);
                $content.push($child);
                $outletFound = true;
            } else if ($searchin.indexOf($partnerName) >= 0 && $active == 'communication') {
                printData(d);
                $content.push($child);
                $outletFound = true;
            } else if ($searchin.indexOf($partnerName) >= 0 && $active == 'dining') {
                printData(d);
                $content.push($child);
                $outletFound = true;
            } else if ($searchin.indexOf($partnerName) >= 0 && $.cookie('city') == data1.City.toLowerCase()) {
                printData(d);
                $content.push($child);
                $outletFound = true;
            }
            /*if ($searchin.indexOf($keyword) >= 0 && $active == 'utility') {
             alert('asdfs');
             printData(d);
             $content.push($child);
             } else if ($searchin.indexOf($keyword) >= 0 && $.cookie('city') == d.City.toLowerCase()) {
             printData(d);
             $content.push($child);
             }*/
        });
        $html = $content.join("");
        $(".data-filter").html('<ul>' + $html + '</ul><div class="clear"></div>');

    }

    $('.submit').click(function() {
        $keyword = $('.input-filter').val().toLowerCase();
        switch ($activeMenu) {
            case 'supply':
                getSearchData($supplyItems, $keyword);
                break;

            case 'courier':
                getSearchData($courierItems, $keyword);
                break;

            case 'communication':
                getSearchData($communicationItems, $keyword);
                break;

            case 'utility':
                getSearchData($utilityItems, $keyword);

            case 'dining':
                getSearchData($diningItems, $keyword);
                break;
        }
        return false;
    });



    $('.a-filter').change(function() {
        id = $(this).val();
        selectbox = true;
        $('.menu_bar li#' + id + ' img').trigger('click');
    });

    $(".fancybox").fancybox({
        'width': 550,
        'padding': 0
    });

    $(".normalppup").fancybox({
        'width': 550,
        'padding': 0
    });
    $(".welcome").fancybox({
        'width': 350,
        height: 60,
        fitToView: false,
        autoSize: false,
        'padding': 0,
        closeClick: false, // prevents closing when clicking INSIDE fancybox 
        helpers: {overlay: {closeClick: false}}, // prevents closing when clicking OUTSIDE fancybox
        afterShow: function() {
            $(".fancybox-close").hide();
        }
    });

    //if ($.cookie('city') == '' || $.cookie('city') == undefined) {
    $('#welcome').trigger('click');
    //}


    $('.city-div .display').text($.cookie('city'));

    $("#city_form").submit(function(event) {
        if ($("#cities").val() === "") {
            alert('Please select city');
            return;
        } else {
            $.cookie('city', $("#cities").val(), {expires: 1});
            parent.$('.city-div .display').text($.cookie('city'));
            parent.$('#change_city').val($.cookie('city'));
            parent.$.fancybox.close();
        }
        event.preventDefault();
    });


    $('#change_city').change(function() {
        if ($("#change_city").val() == "") {
            alert('Please select city');
            return;
        } else {
            $.cookie('city', $("#change_city").val(), {expires: 1});
            $('.city-div .display').text($.cookie('city'));
            $('#' + $active + ' > img').trigger('click');
        }
        event.preventDefault();
        return false;
    });

    $('#change_city').val($.cookie('city'));




    $(document).on('click', '.sharebutton', function(e) {
        e.preventDefault();
        k = "/";
        a = window.top.location.pathname.split('/');
        for (i = 0; i < a.length - 1; i++) {
            if (a[i] !== "") {
                k = k + a[i] + '/';
            }
        }

        FB.ui({
            method: 'feed',
            name: $(this).parent().find('.nm').text(),
            picture: window.top.location.origin + k + 'images/logo_small.png',
            link: window.location.href,
            caption: $heading,
            description: 'Spend at listed merchants in any 4 out of 6 categories mentioned below, every month, and get a complimentary movie voucher for two worth Rs. 700, every month',
            message: ''
        });
    });
});