$(document).ready(function () {
    adminPassword.init()
  })
  
  const adminPassword = (function () {
    const $radioInput = $('input[type="radio"][name="set_password_status"]')
    const $checkedRadioInput = $('input[type="radio"][name="set_password_status"]:checked')
    const $passwordInputWrapper = $('#password-inputs')
  
    const init = () => {
      togglePasswordInputs($checkedRadioInput)
      registerEvents()
    }
  
    const registerEvents = () => {
      $radioInput.on('change', handleInputChange)
    }
  
    const handleInputChange = function () {
      togglePasswordInputs($(this))
    }
  
    const togglePasswordInputs = input => {
      const displayInputs = !!parseInt(input.val())
      displayInputs ? $passwordInputWrapper.removeClass('d-none') : $passwordInputWrapper.addClass('d-none')
    }
  
    return {
      init,
    }
  })()
  