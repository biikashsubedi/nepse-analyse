// tippy('#orderNumber', {
//     animation: 'scale',
//     arrow: true,
//     placement: 'left',
//   content(reference) {
//     const id = reference.getAttribute('data-template');
//     const template = document.getElementById(id);
//     return template.innerHTML;
//   },
//   allowHTML: true,
// });


// tippy('#customerDetail', {
//     animation: 'scale',
//     arrow: true,
//     placement: 'right',
//     followCursor:'horizontal',
//   content(reference) {
//     const id = reference.getAttribute('data-template');
//     const template = document.getElementById(id);
//     return template.innerHTML;
//   },
//   allowHTML: true,
// });

tippy('#editOrderStatus', {
    animation: 'scale',
    arrow: true,
    placement: 'top',
    content: 'Edit Order Status'
})
tippy('#editPaymentMethod', {
    animation: 'scale',
    arrow: true,
    placement: 'top',
    content: 'Edit Payment Method'
})


tippy('#customerDetail', {
    animation: 'scale',
    theme: 'light-border',
    arrow: true,
    placement: 'right',
    followCursor: 'horizontal',
    allowHTML: true,
});

// const instance = tippy(document.querySelectorAll('#orderNumber'));

tippy('#orderNumber', {
    animation: 'scale',
    theme: 'light-border',
    interactive: true,
    arrow: true,
    placement: 'left',
    allowHTML: true,
});

tippy('#productDetail', {
    animation: 'scale',
    theme: 'light-border',
    interactive: true,
    arrow: true,
    placement: 'left',
    allowHTML: true,
});

tippy('#couponDetail', {
    animation: 'scale',
    theme: 'light-border',
    interactive: true,
    arrow: true,
    placement: 'left',
    allowHTML: true,
});

//for Discount
tippy('#discountType', {
    animation: 'scale',
    theme: 'light-border',
    arrow: true,
    placement: 'left',
    followCursor: 'horizontal',
    allowHTML: true,
});

//for customer status
tippy('#customerStatus', {
    animation: 'scale',
    theme: 'light-border',
    arrow: true,
    placement: 'left',
    followCursor: 'horizontal',
    allowHTML: true,
});

tippy('#driverDetail', {
    animation: 'scale',
    theme: 'light-border',
    arrow: true,
    placement: 'right',
    followCursor: 'horizontal',
    allowHTML: true,
});

