// DOM manipulation utilities
export class DOMHelpers {
  static $(selector) {
    return document.querySelector(selector);
  }

  static $$(selector) {
    return document.querySelectorAll(selector);
  }

  static createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  static show(element) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) {
      element.classList.remove('hidden');
      element.classList.add('fade-in');
    }
  }

  static hide(element) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) {
      element.classList.add('hidden');
      element.classList.remove('fade-in');
    }
  }

  static toggle(element) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) {
      element.classList.toggle('hidden');
    }
  }

  static addClass(element, className) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) {
      element.classList.add(className);
    }
  }

  static removeClass(element, className) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) {
      element.classList.remove(className);
    }
  }

  static setContent(element, content) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) {
      element.textContent = content;
    }
  }

  static setHTML(element, html) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) {
      element.innerHTML = html;
    }
  }
}
