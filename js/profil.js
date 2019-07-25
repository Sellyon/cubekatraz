'use strict';
window.document.addEventListener('DOMContentLoaded', function () {
	var description = document.getElementById('description');
	var editDescription = document.getElementById('editDescription');
	var iconEditDescription = document.getElementById('iconEditDescription');
	var descriptionForm = document.getElementById('descriptionForm');
	var cancelEditDescription = document.getElementById('cancelEditDescription');

	iconEditDescription.addEventListener('click', function (event) {
		iconEditDescription.style.display = 'none';
		description.style.display = 'none';
		descriptionForm.style.display = 'initial';
		cancelEditDescription.style.display = 'initial';
		editDescription.innerHTML = description.innerHTML;
		editDescription.value = description.innerHTML
	});

	cancelEditDescription.addEventListener('click', function (event) {
		event.preventDefault();
		description.style.display = 'initial';
		iconEditDescription.style.display = 'initial';
		descriptionForm.style.display = 'none';
		cancelEditDescription.style.display = 'none';
	});
});