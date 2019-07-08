(function(){var $email    = document.getElementById('email');
  var $password = document.getElementById('password');

  /********************
     Validates email
  ********************/

  validateEmail = () => {
    var inputValue = $email.value;
    var hasAtSign = inputValue.indexOf('@') > -1;
    //var hasDot = inputValue.indexOf('.') > -1;

    if(!inputValue) {
      var text = 'Email is a required field';
      showErrorMessage($email, text)
      return false;
    }

    if(!hasAtSign) {
      var text = 'You must enter a valid email address';
      showErrorMessage($email, text)
      return false;
    }
    showErrorMessage($email, null)
    console.log(inputValue, inputValue.length);
    return true;
  }

  /********************
     Validates password
  ********************/

  validatePassword = () => {
    var inputValue = $password.value;
    var length = inputValue.length > 8;
    
    if(!inputValue) {
      var text = 'Password is a required field.';
      showErrorMessage($password, text);
      return false;
    }

    if(!length) {
      var text = 'The password needs to be at least 8 characters long.';
      showErrorMessage($password, text);
      return false;
    }

    showErrorMessage($password, null);
    console.log(inputValue, inputValue.length);
    return true;
  }

  $email.addEventListener('input', validateEmail);
  $password.addEventListener('input', validatePassword);

  showErrorMessage = ($input, message) => {
    var $container = $input.parentElement;

    //Remove an existing errir
    var error = $container.querySelector('.error-message');

    if(error) {
      $container.removeChild(error)
    }

    //Add an error if the message isn't empty
    if(message) {
      var error = document.createElement('div');
          error.classList.add('error-message');
          error.innerText = message;
          $container.appendChild(error);
    }
  }

  validateForm = () => {
    var isValidEmail = validateEmail();
    var isValidPassword = validatePassword();
    return isValidEmail && isValidPassword;
  }


  var $form = document.getElementById('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(validateForm()) {
      console.log('Submitted')
    }
  })


  /********************
     Modals
  ********************/

  var dialogPromiseReject; 

  showModal = (title,text) => {
    var $modalContainer = document.getElementById('modal-container');
        $modalContainer.innerHTML = '';
    
    var modal = document.createElement('div');
        modal.classList.add('modal');
      
    var closeButton = document.createElement('button');
        closeButton.classList.add('modal-close');
        closeButton.innerText = 'Close';
        closeButton.addEventListener('click', hideModal);

    var modalTitle = document.createElement('h1');
        modalTitle.textContent = title;

    var modalContent = document.createElement('p');
        modalContent.innerText = text;
    
        modal.appendChild(closeButton);
        modal.appendChild(modalTitle);
        modal.appendChild(modalContent);
        $modalContainer.appendChild(modal)

    $modalContainer.classList.add('is-visible');
  }

  var pokeUl = document.getElementsByClassName('pokemons-list');
  console.log('All Nodes',pokeUl)
  pokeUl[0].addEventListener('click', () => {
    showModal('Modal Title', 'This is the Modal content')
  });


  /********************
     Hide Modals
  ********************/
  hideModal = () => {
    var $modalContainer =  document.getElementById('modal-container');
        $modalContainer.classList.remove('is-visible');
      console.log('rejected',dialogPromiseReject)
    if(dialogPromiseReject) {
      dialogPromiseReject();
      dialogPromiseReject = null;
    }
  }


  window.addEventListener('keydown', (e) => {
    var $modalContainer =  document.getElementById('modal-container');
    if(e.key=== 'Escape' && $modalContainer.classList.contains('is-visible')){
      hideModal();
    }
  });

  var $modalContainer =  document.getElementById('modal-container');

  $modalContainer.addEventListener('click', (e) => {
    if(e.target === $modalContainer) hideModal();
  
  })

  /********************
     Dialogs
  ********************/

  showDialog =(title, text) => {
    showModal(title, text);
    
    var $modalContainer = document.getElementById('modal-container');
    
    var modal =  $modalContainer.querySelector('.modal');
      
    var confirmButton = document.createElement('button');
        confirmButton.classList.add('modal-confirm');
        confirmButton.innerText = 'Confirm';
    

    var cancelButton = document.createElement('button');
        cancelButton.classList.add('modal-cancel');
        cancelButton.innerText = 'Cancel';
    
        modal.appendChild(confirmButton);
        modal.appendChild(cancelButton);
      

    confirmButton.focus();

    return new Promise((resolve, reject) => {
      cancelButton.addEventListener('click', hideModal);
      confirmButton.addEventListener('click', () => {
        dialogPromiseReject = null;
        hideModal();
        resolve();
      })
      dialogPromiseReject = reject;
    });
    
    
  }

  var $dialogContainer =  document.querySelector('#dialog-container');
      $dialogContainer.addEventListener('click', () => {
        showDialog('Confirm', 'Are you sure you want to do this?').then(()=> {
          alert('Confirmed');
        }, () => {
          alert('not cool');
        })
      })


  var $canvas = document.getElementById('canvas');
  var isDrawing = false;
  var previousX = null;
  var previousY = null;
  
  handleStart = (e) => {
    isDrawing = true;
    //initiate previousX/Y

    var x = e.pageX;
    var y = e.pageY;
        previousX = x;
        previousY = y;
  }

  handleEnd = () => {
    isDrawing = false;
  }

  handleMove = (e) => {
    if(!isDrawing) return;
    
    var x = e.pageX;
    var y = e.pageY;
       

     // This is canvas specific—we can use the context to draw shapes
    var ctx = $canvas.getContext('2d');
        // Draw a line from previousX/previousY to x/y
        ctx.beginPath();
        ctx.moveTo(previousX, previousY);
        ctx.lineTo(x, y);

        // Set the style of the line
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();

        // Set previous coordinates for next move event
        previousX = x;
        previousY = y;

        console.log('moved')
  }



  $canvas.addEventListener("pointerdown", handleStart);
  $canvas.addEventListener("pointerup", handleEnd);
  $canvas.addEventListener("pointercancel", handleEnd);
  $canvas.addEventListener("pointermove", handleMove);

})();


