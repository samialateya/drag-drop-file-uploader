/* ---------------------------- Catch Dom Elements --------------------------- */
const dropArea = document.querySelector('#drop-area');
const gallery = document.querySelector('#gallery');

/* ----------------------------- rendering Items To the DOM ------------------------------ */
export function renderFile(fileData) {
	const HTML = `
			<div class="card mb-3">
				<div class="row g-0">
					<div class="col-md-4">
						<img src="${fileData.path}" class="img-fluid rounded-start" alt="...">
					</div>
					<div class="col-md-8">
						<div class="card-body">
							<input type="text" class="form-control form-group mb-3" placeholder="Title" name="name" value=${fileData.name}>
							<input type="text" class="form-control form-group" placeholder="Tag" name="tag" value=${fileData.tag}>
						</div>
						<div class="card-footer bg-body border-0 card-footer d-flex justify-content-between">
							<a href="javascript:void(0)" class="btn btn-primary update-image" data-id="${fileData.id}">Update</a>
							<a href="javascript:void(0)" class="btn btn-danger delete-image" data-id="${fileData.id}">Remove</a>
						</div>
					</div>
				</div>
			</div>
		`;
	gallery.innerHTML += HTML;
};

//*clear rendering area
export function clearGallery() {
	gallery.innerHTML = '';
};


/* ----------------------------------- Drop Area Highlights ---------------------------------- */

//*highlight the drop area
export function highlight() {
	dropArea.classList.add('highlight');
}

//*un highlight the drop area
export function unHighlight() {
	dropArea.classList.remove('highlight');
}

//loading button
export function isLoading(button, isLoading, text) {
	button.disabled = isLoading;
	button.innerHTML = isLoading ? 'Loading...' : text;
}