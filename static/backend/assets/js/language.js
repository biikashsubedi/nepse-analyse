$(document).ready(function () {
    languageSelector.init()
    translation.init()
  })

  const languageSelector = (function () {
    const $countrySelector = $('#country_id')
    const $languageSelecor = $('#language_code')
    const $prefix = $countrySelector.data('prefix')
    const $url = $countrySelector.data('url')

    const init = () => {
      registerEventListeners()
    }

    const registerEventListeners = () => {
      $countrySelector.on('change', handleCountryChange)
    }

    const handleCountryChange = function () {
      const countyId = $(this).val()
      populateLanguages(countyId)
    }

    const populateLanguages = countryId => {
      let $languageOptions = `<option value="">Select Language</option>`
      $.ajax({
        url: $url + '/' + $prefix + '/country-language/' + countryId,
        type: "GET",
        success: (response) => {
          const languages = response.languages;
          languages.forEach(({ name, iso639_1: code }) => {
            $languageOptions += `<option value="${code}">${name} (${code})</option>`
          })
          $languageSelecor.html($languageOptions)
        },
        error: () => {
          $.toast({
            heading: 'ERROR',
            text: 'Something went wrong.',
            showHideTransition: 'plain',
            icon: 'error',
            position: 'bottom-center',
          })
        },
      })
    }

    return {
      init,
    }
  })()

  const translation = (function () {
    const $content = $('.translation-content')

    const init = () => {
      registerEventListeners()
    }

    const registerEventListeners = () => {
      $content.on('change', handleContentChange)
    }

    const handleContentChange = function () {
      const group = $(this).data('group');
      const locale = $(this).data('locale');
      updateText($(this).val(), $(this).data('href'), group, locale)
    }

    const updateText = (value, url, group, locale) => {
      const $csrfToken = $('meta[name="csrf"]').attr('content');
      $.ajax({
        url,
        type: 'PUT',
        data: {
          text: value,
          group : group,
          locale : locale,
          _token: $csrfToken,
        },
        success: () => {
          $.toast({
            heading: 'Success',
            text: 'Successfully updated.',
            showHideTransition: 'plain',
            icon: 'success',
            position: 'bottom-center',
          })
        },
        error: () => {
          $.toast({
            heading: 'ERROR',
            text: 'Something went wrong.',
            showHideTransition: 'plain',
            icon: 'error',
            position: 'bottom-center',
          })
        },
      })
    }

    return { init }
  })()
