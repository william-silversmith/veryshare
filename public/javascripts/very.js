$(document).ready(function() {

	$('#share').alwaysCenterIn(document, {
		top: -50,
	});
	
	setTimeout(function () { 
		shakaroo($('#share')); 
	}, 500);

	setInterval(function() {
		shakaroo($('#share'));
	}, Math.round(Math.random() * (7000) + 5000));

	$('#share').mouseenter(function(){
		$(this).fadeTo('fast', .5);
	});

	$('#share').mouseleave(function(){
		$(this).fadeTo('fast', 1);
	});

	$('#share').click(function(){
		$(this).fadeOut('fast');
	});
});

function shakaroo (element) {
	var bool = Math.round(Math.random()); // true/false

	var direction = bool 
		? 'up' 
		: 'left';
		
	$(element).effect('shake', {
		times: 3, 
		distance: 3,
		direction: direction,
	}, 25);
}


