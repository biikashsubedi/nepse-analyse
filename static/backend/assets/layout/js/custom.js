if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function( $, window, document, undefined ) {

    "use strict";
    
    var Toast = {

        _positionClasses : ['bottom-left', 'bottom-right', 'top-right', 'top-left', 'bottom-center', 'top-center', 'mid-center'],
        _defaultIcons : ['success', 'error', 'info', 'warning'],

        init: function (options, elem) {
            this.prepareOptions(options, $.toast.options);
            this.process();
        },

        prepareOptions: function(options, options_to_extend) {
            var _options = {};
            if ( ( typeof options === 'string' ) || ( options instanceof Array ) ) {
                _options.text = options;
            } else {
                _options = options;
            }
            this.options = $.extend( {}, options_to_extend, _options );
        },

        process: function () {
            this.setup();
            this.addToDom();
            this.position();
            this.bindToast();
            this.animate();
        },

        setup: function () {
            
            var _toastContent = '';
            
            this._toastEl = this._toastEl || $('<div></div>', {
                class : 'jq-toast-single'
            });

            // For the loader on top
            _toastContent += '<span class="jq-toast-loader"></span>';            

            if ( this.options.allowToastClose ) {
                _toastContent += '<span class="close-jq-toast-single">&times;</span>';
            };

            if ( this.options.text instanceof Array ) {

                if ( this.options.heading ) {
                    _toastContent +='<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
                };

                _toastContent += '<ul class="jq-toast-ul">';
                for (var i = 0; i < this.options.text.length; i++) {
                    _toastContent += '<li class="jq-toast-li" id="jq-toast-item-' + i + '">' + this.options.text[i] + '</li>';
                }
                _toastContent += '</ul>';

            } else {
                if ( this.options.heading ) {
                    _toastContent +='<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
                };
                _toastContent += this.options.text;
            }

            this._toastEl.html( _toastContent );

            if ( this.options.bgColor !== false ) {
                this._toastEl.css("background-color", this.options.bgColor);
            };

            if ( this.options.textColor !== false ) {
                this._toastEl.css("color", this.options.textColor);
            };

            if ( this.options.textAlign ) {
                this._toastEl.css('text-align', this.options.textAlign);
            }

            if ( this.options.icon !== false ) {
                this._toastEl.addClass('jq-has-icon');

                if ( $.inArray(this.options.icon, this._defaultIcons) !== -1 ) {
                    this._toastEl.addClass('jq-icon-' + this.options.icon);
                };
            };

            if ( this.options.class !== false ){
                this._toastEl.addClass(this.options.class)
            }
        },

        position: function () {
            if ( ( typeof this.options.position === 'string' ) && ( $.inArray( this.options.position, this._positionClasses) !== -1 ) ) {

                if ( this.options.position === 'bottom-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        bottom: 20
                    });
                } else if ( this.options.position === 'top-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: 20
                    });
                } else if ( this.options.position === 'mid-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: ( $(window).outerHeight() / 2 ) - this._container.outerHeight()/2
                    });
                } else {
                    this._container.addClass( this.options.position );
                }

            } else if ( typeof this.options.position === 'object' ) {
                this._container.css({
                    top : this.options.position.top ? this.options.position.top : 'auto',
                    bottom : this.options.position.bottom ? this.options.position.bottom : 'auto',
                    left : this.options.position.left ? this.options.position.left : 'auto',
                    right : this.options.position.right ? this.options.position.right : 'auto'
                });
            } else {
                this._container.addClass( 'bottom-left' );
            }
        },

        bindToast: function () {

            var that = this;

            this._toastEl.on('afterShown', function () {
                that.processLoader();
            });

            this._toastEl.find('.close-jq-toast-single').on('click', function ( e ) {

                e.preventDefault();

                if( that.options.showHideTransition === 'fade') {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.fadeOut(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else if ( that.options.showHideTransition === 'slide' ) {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.slideUp(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.hide(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                }
            });

            if ( typeof this.options.beforeShow == 'function' ) {
                this._toastEl.on('beforeShow', function () {
                    that.options.beforeShow(that._toastEl);
                });
            };

            if ( typeof this.options.afterShown == 'function' ) {
                this._toastEl.on('afterShown', function () {
                    that.options.afterShown(that._toastEl);
                });
            };

            if ( typeof this.options.beforeHide == 'function' ) {
                this._toastEl.on('beforeHide', function () {
                    that.options.beforeHide(that._toastEl);
                });
            };

            if ( typeof this.options.afterHidden == 'function' ) {
                this._toastEl.on('afterHidden', function () {
                    that.options.afterHidden(that._toastEl);
                });
            };

            if ( typeof this.options.onClick == 'function' ) {
                this._toastEl.on('click', function () {
                    that.options.onClick(that._toastEl);
                });
            };    
        },

        addToDom: function () {

             var _container = $('.jq-toast-wrap');
             
             if ( _container.length === 0 ) {
                
                _container = $('<div></div>',{
                    class: "jq-toast-wrap",
                    role: "alert",
                    "aria-live": "polite"
                });

                $('body').append( _container );

             } else if ( !this.options.stack || isNaN( parseInt(this.options.stack, 10) ) ) {
                _container.empty();
             }

             _container.find('.jq-toast-single:hidden').remove();

             _container.append( this._toastEl );

            if ( this.options.stack && !isNaN( parseInt( this.options.stack ), 10 ) ) {
                
                var _prevToastCount = _container.find('.jq-toast-single').length,
                    _extToastCount = _prevToastCount - this.options.stack;

                if ( _extToastCount > 0 ) {
                    $('.jq-toast-wrap').find('.jq-toast-single').slice(0, _extToastCount).remove();
                };

            }

            this._container = _container;
        },

        canAutoHide: function () {
            return ( this.options.hideAfter !== false ) && !isNaN( parseInt( this.options.hideAfter, 10 ) );
        },

        processLoader: function () {
            // Show the loader only, if auto-hide is on and loader is demanded
            if (!this.canAutoHide() || this.options.loader === false) {
                return false;
            }

            var loader = this._toastEl.find('.jq-toast-loader');

            // 400 is the default time that jquery uses for fade/slide
            // Divide by 1000 for milliseconds to seconds conversion
            var transitionTime = (this.options.hideAfter - 400) / 1000 + 's';
            var loaderBg = this.options.loaderBg;

            var style = loader.attr('style') || '';
            style = style.substring(0, style.indexOf('-webkit-transition')); // Remove the last transition definition

            style += '-webkit-transition: width ' + transitionTime + ' ease-in; \
                      -o-transition: width ' + transitionTime + ' ease-in; \
                      transition: width ' + transitionTime + ' ease-in; \
                      background-color: ' + loaderBg + ';';


            loader.attr('style', style).addClass('jq-toast-loaded');
        },

        animate: function () {

            var that = this;

            this._toastEl.hide();

            this._toastEl.trigger('beforeShow');

            if ( this.options.showHideTransition.toLowerCase() === 'fade' ) {
                this._toastEl.fadeIn(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            } else if ( this.options.showHideTransition.toLowerCase() === 'slide' ) {
                this._toastEl.slideDown(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            } else {
                this._toastEl.show(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            }

            if (this.canAutoHide()) {

                var that = this;

                window.setTimeout(function(){
                    
                    if ( that.options.showHideTransition.toLowerCase() === 'fade' ) {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.fadeOut(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    } else if ( that.options.showHideTransition.toLowerCase() === 'slide' ) {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.slideUp(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    } else {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.hide(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    }

                }, this.options.hideAfter);
            };
        },

        reset: function ( resetWhat ) {

            if ( resetWhat === 'all' ) {
                $('.jq-toast-wrap').remove();
            } else {
                this._toastEl.remove();
            }

        },

        update: function(options) {
            this.prepareOptions(options, this.options);
            this.setup();
            this.bindToast();
        },
        
        close: function() {
            this._toastEl.find('.close-jq-toast-single').click();
        }
    };
    
    $.toast = function(options) {
        var toast = Object.create(Toast);
        toast.init(options, this);

        return {
            
            reset: function ( what ) {
                toast.reset( what );
            },

            update: function( options ) {
                toast.update( options );
            },
            
            close: function( ) {
            	toast.close( );
            }
        }
    };

    $.toast.options = {
        text: '',
        heading: '',
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        loader: true,
        loaderBg: '#9EC600',
        stack: 5,
        position: 'bottom-left',
        bgColor: false,
        textColor: false,
        textAlign: 'left',
        icon: false,
        beforeShow: function () {},
        afterShown: function () {},
        beforeHide: function () {},
        afterHidden: function () {},
        onClick: function () {}
    };

})( jQuery, window, document );


jQuery.fn.sortElements = (function () {

    var sort = [].sort;

    return function (comparator, getSortable) {

        getSortable = getSortable || function () {
                return this;
            };

        var placements = this.map(function () {

            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,

                // Since the element itself will change position, we have
                // to have some way of storing it's original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );

            return function () {

                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }

                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);

            };

        });

        return sort.call(this, comparator).each(function (i) {
            placements[i].call(getSortable.call(this));
        });

    };

})();


var table1 = $('#skutable');

$('#skuheader, #brandheader,#createdheader')
    .wrapInner('<span title="sort this column"/>')
    .each(function () {

        var th = $(this),
            thIndex = th.index(),
            inverse = false;

        th.click(function () {

            table1.find('td').filter(function () {

                return $(this).index() === thIndex;

            }).sortElements(function (a, b) {

                return $.text([a]) > $.text([b]) ?
                    inverse ? -1 : 1
                    : inverse ? 1 : -1;

            }, function () {

                // parentNode is the element we want to move
                return this.parentNode;

            });

            inverse = !inverse;

        });

    });

var tt1 = 0;
$("#tt1").on('click', function () {
    tt1 = tt1 + 1;
    if (tt1 % 2 == 0) {
        $("#tt1").html("<i class='fa fa-sort-desc' aria-hidden='true'></i>");
    } else {
        $("#tt1").html("<i class='fa fa-sort-asc' aria-hidden='true'></i>");
    }

});

var tt2 = 0;
$("#tt2").on('click', function () {
    tt2 = tt2 + 1;
    if (tt2 % 2 == 0) {
        $("#tt2").html("<i class='fa fa-sort-desc' aria-hidden='true'></i>");
    } else {
        $("#tt2").html("<i class='fa fa-sort-asc' aria-hidden='true'></i>");
    }

});

$('table[data-form="deleteForm"]').on('click', '.form-delete', function (e) {
    e.preventDefault();
    var $form = $(this);
    $('#confirm').modal({backdrop: 'static', keyboard: false})
        .on('click', '#delete-btn', function () {
            $form.submit();
        });
});


$('table[data-form="deleteForm"]').on('click', '.form-activate', function (e) {
    e.preventDefault();
    var $form = $(this);
    $('#confirmActivate').modal({backdrop: 'static', keyboard: false})
        .on('click', '#update-btn', function () {
            $form.submit();
        });
});

$('table[data-form="deleteForm"]').on('click', '.form-update', function (e) {
    e.preventDefault();
    var $form = $(this);
    $('#confirmupdate').modal({backdrop: 'static', keyboard: false})
        .on('click', '#update-btn', function () {
            $form.submit();
        });
});

$('.img-remove').on('click', function (e) {
    e.preventDefault();
    var $form = $(this);
    $('#confirm').modal({backdrop: 'static', keyboard: false})
        .on('click', '#delete-btn', function () {

            location.href = $form.attr('href');
        });

});


jQuery('#moduleChange').change(function () {
    this.form.submit();
});

$('#sms_title, #email_title').on('keyup change click', function () {
    var slug = cleanUp($(this).val());
    var title = $(this).attr('id');
    if(title === 'sms_title')
        $('#sms_slug').val(slug);
    else
        $('#email_slug').val(slug);
});

function cleanUp(string) {
    return string.
    replace(/[^a-z0-9]+/gi, '-').
    replace(/^-+/, '').
    replace(/-+$/, '').toLowerCase();
}

$('#config_module').on('change', function () {
    if($(this).val()) {
        $.get(base_url + '/sms-mail/viewService', {module: $(this).val()}, function (data) {
            $('#service').css('display', '');
            $('#service').html('');
            $('#service').html(data);
        });
    } else {
        $('#service').attr('style', 'display: none;');
        $('#service_field').attr('style', 'display: none;');
        $('#service').html('');
        $('#service_field').html('');
    }
});

$('#service').on('change', '#config_service', function () {
    if($(this).val()) {
        $.get(base_url + '/sms-mail/viewServiceField', {service: $(this).val()}, function (data) {
            $('#service_field').css('display', '');
            $('#service_field').html('');
            $('#service_field').html(data);
        });
    } else {
        $('#service_field').attr('style', 'display: none;');
        $('#service_field').html('');
    }
});

$('.parent, .childclass').on('click', function () {
    var thisobject = $(this);
    var parentId = thisobject.data('parent-id');
    zone_id = thisobject.data('zone-id');

    if (thisobject.hasClass('parent')) {

        $('.listings').each(function () {
            $(this).removeClass('parent');
            $(this).addClass('child');
            $(this).css('display', 'none');
        });

    }


    if (thisobject.parents('.listings').hasClass('parent')) {

        CheckParents(thisobject.parents('.listings'));

    }


    if ($('.block' + zone_id)[0]) {

        thisobject.parents('.listings').removeClass("child").addClass("parent");
        $('.child').hide();
        $('.block' + zone_id).show();

    } else {
        $('.child').hide();
        thisobject.parents('.listings').removeClass("parent").addClass("child")
        thisobject.parents('.listings').show();
    }


    thisobject.parent().find("li").removeClass("active");
    thisobject.addClass("active");
    $("#panel1 ul li").click(function () {
        $(this).parent().find("li").removeClass("active");
        $(this).addClass("active");
    });


});

function CheckParents(thisobject) {

    allBlock = thisobject.parents('.list-inner').next().children().children()

    allBlock.each(function () {
        if ($(this).hasClass('parent')) {
            $(this).removeClass("parent").addClass("child")

            CheckParents($(this));

        }
    });

}

$('.payment').on('change', function () {
    var that = $(this);
    $('.loaderImage').show();
    var url = base_url + '/change-payment-attribute';
    var option = (that.hasClass('method')) ? 'method' : 'status';
    var delivery_status = that.parent().parent().find('#delivery_status').data('value');
    var payMethod = null;
    if(option === 'method')
        payMethod = that.find('option:selected').text();
    var value = that.val();
    var orderId = that.parent().parent().find('input#hiddenOrderId').val();
    $.ajax({
        url : url,
        type : 'get',
        data : {
            'value' : value,
            'order_id' : orderId,
            'option' : option,
            'payMethod' : payMethod,
            'delivery_status' : delivery_status
        },
        success : function() {
            $('.loaderImage').hide();
            $.toast('Payment Info Updated!', {
                type:'success',
                align: 'top'
            });
        },
        error: function () {
            $('.loaderImage').hide();
            $.toast('Sorry, Error Occurred!');
        }
    })
});
/**
 * Add New Order JQuery Start
 */
var div = $('#delivery-addr-field');
var itemDiv = $('#orderProduct');
var createBtn = $('#btn-create-order');

div.on('click keydown', '.addr_title', function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code === 13) {
        e.preventDefault();
        return false;
    }
});

div.on('click keydown', '.latlong', function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code === 13) {
        e.preventDefault();
        return false;
    }

    div.find('.repeater .latlong').removeClass('selected');
    $(this).addClass('selected');

});

div.on('keydown', '#pac-input', function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code === 13) {
        e.preventDefault();
    }
});

$(function () {
    $('.btn-delivery').on('click', function () {
        $('.loaderImage').show();
        var latlong = $('#search').val().split(', ');
        var pageurl = $(location).attr('href');
        $.ajax({
            url: base_url + '/get-address-by-latlong',
            type: 'get',
            data: {
                lat: latlong[0],
                long: latlong[1],
                pageurl: pageurl
            },
            success: function (response) {
                console.log(response.view);
                debugger;
                $('#address-container').html(response.view);
                $('.loaderImage').hide();
            },
            error: function () {
                $.toast('Latitude Longitude Not Valid!', {
                    align: 'top'
                });
                $('#adr_province').removeAttr('disabled');
                $('#adr_district').removeAttr('disabled');
                $('#adr_government').removeAttr('disabled');
                $('#adr_ward').removeAttr('disabled');
                $('.loaderImage').hide();
            }
        });
    });
});

itemDiv.on('change keyup keypress', '#item-qty', function (e) {
    var that = $(this);
    var price = that.parent().data('price');
    if (!that.hasClass('decimal') && e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        that.next("span").attr('style','color:red;').html("Digits Only").show().fadeOut("slow");
        return false;
    }

    if(that.val() < 0)
        that.val('');
    if(that.val() >= 999)
        that.val(999);

    var total = parseFloat(that.val()) * parseFloat(price);
    if (isNaN(total))
        total = 0;
    debugffer;
    that.parent().parent().find('.total-amt').text(total.toFixed(2));
    that.parent().parent().find('.total-amt').next('input').val(total.toFixed(2));
});

itemDiv.on('click', '.mrg20B', function () {
    $(this).closest('tr').remove();
    if($('#orderProduct').children('tr').length <= 0)
        createBtn.attr('disabled', 'disabled');
    else
        createBtn.removeAttr('disabled');
});

createBtn.on('click', function (e) {
    e.preventDefault();
    var sum = 0;
    var check = 1;
    var minimum_price = $(this).data('minimum');
    itemDiv.find($('.total-amnt')).each(function () {
        sum += parseInt($(this).text());
    });

    itemDiv.find($('#item-qty')).each(function () {
        if($(this).val() <= 0) {
            $.toast('Sorry, item quantity must not be 0!', {
                align: 'top'
            });
            check = 0;
        }
    });

    if(check === 1) {
        if (sum < minimum_price) {
            $.toast('Sorry, the minimum checkout price was not met!', {
                align: 'top'
            });
        }
        else if($('.select-status').val() === '' || $('.select-status').val() === null) {
            $.toast('Please select a status!', {
                align: 'top'
            });
        }
        else if($('.select-warehouse').val() === '' || $('.select-warehouse').val() === null) {
            $.toast('Please select a warehouse!', {
                align: 'top'
            });
        }
        else if($('.latlong').val() === '' || $('.latlong').val() === null) {
            $.toast('Please select at-least one address!', {
                align: 'top'
            });
        }
        // else if($('#adr_province').val().length <= 0) {
        //     $.toast('Please verify the given address!', {
        //         align: 'top'
        //     });
        // }
        else {
            $('#add-form').submit();
        }
    }

});


/**
 * Add New Order JQuery Stop
 */


/**
 * Delete Pending Order
 */

$('.btn-delete').on('click', function (e) {
    e.preventDefault();
    that = $(this);
    /*$('#confirm-submit').on('show.bs.modal', function () {
        $(this).find('#submitDeleteForm').attr('href', that.data('href'));
    });*/

    $('#confirm-submit').on('click', '#submitDeleteForm', function () {
        window.location.href = that.data('href');
    });
});

/**
 * Delete Pending Order Stop
 */

/**
tbody class row-position
 **/
$('.row-position').sortable({
    delay: 150,
    cursor: 'move',
    opacity: 0.6,
    stop: function () {
        sortData();
    }
});

function sortData() {
    var order = [];
    var action = $('tbody').data('action');
    $('tr.tr-row').each(function(index,element) {
        order.push({
            id: $(this).data('id'),
            position: index + 1
        });
    });
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "POST",
        url: "sort-data",
        data: {
            order: order,
            action: action
        }
    });
}
