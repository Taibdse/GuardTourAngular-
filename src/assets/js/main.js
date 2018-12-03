// $('.dropdown-submenu .dropdown-toggle').on("click", function(e) {
//   e.stopPropagation();
//   e.preventDefault();
//   $(this).parent().siblings().children('.dropdown-menu').css({
//     display: 'none'
//   });
//   $(this).next('.dropdown-menu').toggle();
// });

// $('.dropdown').on('hidden.bs.dropdown', function () {
//   $('.dropdown-submenu .dropdown-menu').css({
//     display:'none'
//   })
// })

$('.datepicker').datepicker();

$('.datetimepicker').datetimepicker({
  format: 'yyyy-mm-dd hh:ii'
})

$('.datetimepicker-bootstrap4').datetimepicker({
  // format: 'LT'
   format: 'HH:mm'
});