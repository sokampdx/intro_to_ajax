
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street_value = $('#street').val();
    var city_value = $('#city').val();
    var address = street_value + ', ' + city_value;

    // YOUR CODE GOES HERE!
    $greeting.text('So, you want to live at ' + address + '?');

    var streetview_url = 'http://maps.googleapis.com/maps/api/streetview?size=800x600&location=' + address + '';
	var img_html = '<img class="bgimg" src="' + streetview_url + '">'
    $body.append(img_html);

    //2bf83b4a30eb4586a75b52e8da1fb10c
	//bdf24466ac6148f5a951e3459c6191c9

	var nyt_api_url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';

	nyt_api_url += '?' + $.param({
		'api-key': '2bf83b4a30eb4586a75b52e8da1fb10c',
		'q': city_value,
		'sort': 'newest'
	});

	$.getJSON( nyt_api_url, function( data ) {

        $nytHeaderElem.text('New York Times Articles About ' + city_value);

        var articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' +
                article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' + '</li>');
        };
    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    var wiki_api_url = 'https://en.wikipedia.org/w/api.php';

    wiki_api_url += '?' + $.param({
        'action': 'opensearch',
        'search': city_value,
        'format': 'json',
        'callback': 'wikiCallback'
    });

    var wiki_request_timeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wiki_api_url,
        dataType: "jsonp",
        success: function( response ) {
            var articles = response[1];

            for (var i = 0; i < articles.length; i++) {
                var article = articles[i];
                var url = 'http://en.wikipedia.org/wiki' + article;
                $wikiElem.append('<li><a href="' + url + '">' +
                    article + '</a></li>');
            };

            clearTimeout(wiki_request_timeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);

// loadData();
