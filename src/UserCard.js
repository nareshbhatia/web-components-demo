const template = document.createElement('template');

template.innerHTML = `
<style>
  .user-card {
		font-family: 'Arial', sans-serif;
		background: #f4f4f4;
		width: 500px;
		display: grid;
		grid-template-columns: 1fr 2fr;
		grid-gap: 10px;
		margin-bottom: 15px;
		border-bottom: darkorchid 5px solid;
	}

	.user-card img {
		width: 100%;
	}

	.user-card button {
		cursor: pointer;
		background: darkorchid;
		color: #fff;
		border: 0;
		border-radius: 5px;
		padding: 5px 10px;
	}
</style>

<div class="user-card">
  <img id="avatar-image" />
  <div>
    <h3 id="name-element"></h3>
    <div class="info">
      <p><slot name="email" /></p>
      <p><slot name="phone" /></p>
    </div>
    <button id="toggle-button">Hide Info</button>
  </div>
</div>
`;

class UserCard extends HTMLElement {
  // ----- Field Declarations -----
  showInfo = true;

  // ----- Properties (reflected from attributes) -----
  get name() {
    return this.getAttribute('name');
  }
  set name(val) {
    this.setAttribute('name', val);
  }

  get avatar() {
    return this.getAttribute('avatar');
  }
  set avatar(val) {
    this.setAttribute('avatar', val);
  }

  // ----- Observed Attributes -----
  static get observedAttributes() {
    return ['name', 'avatar'];
  }

  // ----- Attribute changes should update properties -----
  attributeChangedCallback(name, old, val) {
    switch (name) {
      case 'name':
        this.nameElement.innerText = val;
        break;
      case 'avatar':
        this.avatarImage.src = val;
        break;
    }
  }

  constructor() {
    super();

    // Create a shadow root
    this.attachShadow({ mode: 'open' });

    // Append template to shadow root
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Create references to elements
    // use getElementById() or querySelector() as appropriate
    this.nameElement = this.shadowRoot.getElementById('name-element');
    this.avatarImage = this.shadowRoot.getElementById('avatar-image');
    this.infoBlock = this.shadowRoot.querySelector('.info');
    this.toggleButton = this.shadowRoot.querySelector('#toggle-button');
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector('#toggle-button')
      .addEventListener('click', () => this.toggleInfo());
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('#toggle-button').removeEventListener();
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;

    if (this.showInfo) {
      this.infoBlock.style.display = 'block';
      this.toggleButton.innerText = 'Hide Info';
    } else {
      this.infoBlock.style.display = 'none';
      this.toggleButton.innerText = 'Show Info';
    }
  }
}

customElements.define('user-card', UserCard);
