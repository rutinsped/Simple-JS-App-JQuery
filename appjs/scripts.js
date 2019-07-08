(function (){
  
  pokemonRepository = (function (){
    var repository = []
  
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  
    function add(pokemon) {
      repository.push(pokemon);
    }
  
    function getAll() {
      return repository;
    }
	
	// When called loads the list of pokemons from the API
    // to the repository variable.
	
    function loadList() {
      console.log('%c LOAD-LIST CALLED', 'color: blue; font-size: 20px; font-weight:bold;');
      return fetch(apiUrl).then(function (response) {
        return response.json();
      }).then(function (json) {
        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      }).catch(function(e) {
        console.error(e);
      })
    }
	
	
    function loadDetails(pokemon) {
      console.log('%c LOAD-DETAILS CALLED', 'color: blue; font-size: 20px; font-weight:bold;');
      console.log(pokemon);
      var url = pokemon.detailsUrl;
      return $.ajax(url, {
		method: 'GET',
		dataType: 'json'
		}).then(function (response) {
      console.log('response',response)
        pokemon.imageUrl = response.sprites.front_default;
        pokemon.height = response.height;
        pokemon.types = Object.keys(response.types);
      })
      .catch(function (e) {
        console.log(e);
      });
    }
	
	 // to access any method, function or variable
    // in the function it has to be returned.
    return {
      add: add,
      getAll: getAll,
      loadList: loadList,
      loadDetails: loadDetails,
    }

  })();
  // pokeRepository Function.

  // We first call the loadlist fuction
  // and call the addListItem function 
  // passing each pokemon to it.
  
  pokemonRepository.loadList().then(function(){
    var pokemons = pokemonRepository.getAll()
    console.log(pokemons)
    pokemons.forEach(addListItem);
  });

  var $modalContainer = $('#modal-container');

  // addListItem takes the pokemons and creates
  // a list element and a button for each.
  // Then creates a click event for each button
  // when then calls the showDetails function
  // passing it the pokemon.

  
  
  function addListItem(pokemon) {
    var $listItemElement = $('<li>');
    var $btn = $('<button>'+pokemon.name+'</button>');
    $btn.addClass('pokebutton');
      
    $listItemElement.append($btn);
    $btn.click(function() {
      showDetails(pokemon)
    });

    $('.pokelist').append($listItemElement);
  }

  /* The showDetails recieves the pokemon
      and then passes it to the loadDetails
      function
  */

function showDetails(pokemon) {
  pokemonRepository.loadDetails(pokemon)
    .then(function() {

         
      var $modal = $('<div>');
      $modal.addClass('modal');
      var $closeBtn = $('<button>'); 
      var $image = $('<img>');
      var $h1 = $('<h1>');
      var $height = $('<p>'+pokemon.height+'</p>');
            
      $modal.append($closeBtn);      
      $closeBtn.addClass('close');
      $closeBtn.html('Close');

      $image.attr('src',pokemon.imageUrl);
      $image.addClass('pokemon-img');
      $modal.append($image);

      $h1.html(pokemon.name);
      $h1.addClass('h1');
      $modal.append($h1);

      $height.html('Height - ' + pokemon.height);
      $modal.append($height); 
      $height.addClass('height');

      var $exist = $modalContainer.children('.modal');
        if ($exist) {
        $exist.remove(); 
        }
     

      $modalContainer.append($modal)
      $modalContainer.addClass('is-visible');
      $closeBtn.click(hideModal);
      
    });
  }
  
  function hideModal() {
    $modalContainer.removeClass('is-visible');
  }; 
  
  $(window).keydown(function(event) {
    if (event.key === 'Escape') {
      hideModal();  
    }
  });

   
  $modalContainer.click(function (event) {     
    if (event.target === this) {
      hideModal();
    }
  });

    
})();























