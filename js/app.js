//catch HTML Elements
const fileElement = document.querySelector('#file-element');
const dropArea = document.querySelector('#drop-area');
const gallery = document.querySelector('#gallery');

//catch and handle 'dragenter', 'dragover', 'dragleave', 'drop'
const dragEvents = ['dragenter', 'dragover', 'dragleave', 'drop'];


/* ----------------------------- events catcher ----------------------------- */

//first remove default browser behavior from each event
dragEvents.forEach(eventName => {
	dropArea.addEventListener(eventName, preventDefaults, false)
});

//highlight the drop area when the user enters it
['dragenter', 'dragover'].forEach(eventName => {
	dropArea.addEventListener(eventName, highlight, false)
});

//un highlight the drop area when the user leaves it
['dragleave', 'drop'].forEach(eventName => {
	dropArea.addEventListener(eventName, unHighlight, false)
});

//upload the file when the user drops it
dropArea.addEventListener('drop', handleDrop, false);

//*catch the file input and upload the file
fileElement.addEventListener('change', function(e){
	const files = e.target.files;
	//loop through the files and preview them
	[...files].forEach(file => previewFile(file));
},)


/* ----------------------------- events handlers ---------------------------- */

//*prevent default browser behavior for the events
function preventDefaults(e) {
	e.preventDefault();
	e.stopPropagation();
}

//*highlight the drop area
function highlight() {
	dropArea.classList.add('highlight');
}

//*un highlight the drop area
function unHighlight() {
	dropArea.classList.remove('highlight');
}

//*catch dragged files and prepare them for upload
function handleDrop(e) {
	const files = e.dataTransfer.files;
	//loop through the files and preview them
	[...files].forEach(file => previewFile(file));
}



//*preview the file
function previewFile(file) {
	let reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onloadend = function () {
		gallery.innerHTML += renderItem(file, reader.result);
	}
}


/* ----------------------------- rendering ------------------------------ */
function renderItem(fileData, imgSrc) {
	const HTML = `
		<div class="card mb-3">
			<div class="row g-0">
				<div class="col-md-4">
					<img src="${imgSrc}" class="img-fluid rounded-start" alt="...">
				</div>
				<div class="col-md-8">
					<div class="card-body">
						<input type="text" class="form-control form-group mb-3" placeholder="Title" value=${fileData.name}>
						<input type="text" class="form-control form-group" placeholder="Tag">	
					</div>
					<div class="card-footer bg-body border-0 card-footer d-flex justify-content-between">
						<a href="#" class="btn btn-primary">Update</a>
						<a href="#" class="btn btn-danger">Remove</a>
					</div>
				</div>
			</div>
		</div>
	`;
	return HTML;
}