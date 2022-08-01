const LOCAL_STORAGE_KEY = 'FORM_DATA';

const getById = (id) => document.getElementById(id);

window.addEventListener('DOMContentLoaded', () => {
  const numberOfSteps = 3;

  const defaultData = {
    firstName: null,
    secondName: null,
    birthday: null,
    phoneNumber: null,
    email: null,
    policyNumber: null,
    travelPurpose: 'tourism',
    country: null,
    address: null,
    date: null,
    incidentDescription: null,
    expenses: [
      {
        id: 1,
        name: 'very very very very very expensive item',
        price: 1000000,
      },
      { id: 2, name: 'not so much expensive item', price: 10000 },
      { id: 3, name: 'cheap item', price: 100 },
      { id: 4, name: 'just an item', price: 10 },
      { id: 5, name: 'item', price: 1 },
    ],
  };

  const toastMessages = [
    'The expense has been successfully deleted!',
    'The expense has been successfully updated!',
    'New Expense successfully added!',
    'The data has been saved successfully!',
  ];

  const dataFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
  const formData =
    dataFromLocalStorage !== null
      ? JSON.parse(dataFromLocalStorage)
      : defaultData;

  const generateRandomId = () => {
    const generateRandomIdHelper = () =>
      Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1;
    const unavailableIds = formData.expenses.map(({ id }) => id);

    let generatedId = generateRandomIdHelper();

    while (unavailableIds.includes(generatedId)) {
      generatedId = generateRandomIdHelper();
    }

    return generatedId;
  };

  const mapExpensesToListItems = (expenses) =>
    expenses.map(
      ({ id, name, price }) =>
        `<li class="list-item flex-row">
          <span class="price text-bold">
            ${price}&#36;
          </span>
          <span class="name" title="${name}">
            ${name}
          </span>
          <div class="actions-container">
            <button
              type="button"
              id="remove-button#${id}"
              aria-label="Remove the expense"
              aria-haspopup="dialog"
            >
              <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              id="edit-button#${id}"
              aria-label="Edit expense"
              aria-haspopup="dialog"
            >
              <i class="fa-solid fa-pen" aria-hidden="true"></i>
            </button>
          </div>
        </li>`
    );

  const mapClickedButtonToExpenseItem = (clickedButton) => {
    const elementId = clickedButton.getAttribute('id');
    const expenseId = +elementId.split('#').reverse()[0];
    const expenseItem = formData.expenses.find(({ id }) => id === expenseId);

    return expenseItem;
  };

  const createAddOrEditExpenseDialog = (
    expenseItem = { id: null, name: '', price: 1 }
  ) => `
    <div
      class="modal-dialog position-absolute"
      id="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <button
        type="button"
        class="dialog-close"
        id="dialog-close-button"
        aria-label="Close the dialog"
      >
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
      <h2 class="dialog-heading heading-2 text-center" id="dialog-title">
        ${expenseItem.id !== null ? 'Edit' : 'New'} Expense
      </h2>
      <form class="dialog-form" id="dialog-form">
        <div class="form-control flex-column">
          <label for="expense-name" class="text-bold">
            Name (max length 50 characters)
          </label>
          <input
            type="text"
            id="expense-name"
            name="expense-name"
            maxlength="50"
            title="Please enter a name that is no longer than 50 characters"
            value="${expenseItem.name}"
            required
          />
        </div>
        <div class="form-control flex-column">
          <label for="expense-price" class="text-bold">
            Price (between 1 and 1,000,000)
          </label>
          <input
            type="number"
            id="expense-price"
            name="expense-price"
            min="1" max="1000000"
            title="The price should be between 1 and 1,000,000"
            value="${expenseItem.price}"
            required
          />
        </div>
        <div class="form-buttons flex-row justify-content-center">
          <button type="button" class="btn btn-secondary" id="cancel-button">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" id="action-button">
            ${expenseItem.id !== null ? 'Edit' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  `;

  const createToastSuccessMessage = (toastMessageIndex) => `
    <div
      class="toast position-fixed"
      id="toast"
      role="status"
      aria-label="Success message"
    >
      <button
        type="button"
        class="toast-close text-white"
        id="toast-close-button"
        aria-label="Close the toast message"
      >
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
      <div class="toast-content flex-row justify-content-between">
        <i class="fa-solid fa-circle-check text-white" aria-hidden="true"></i>
        <p class="toast-message text-bold text-center text-white">
          ${toastMessages[toastMessageIndex]}
        </p>
      </div>
    </div>
  `;

  const deleteConfirmationDialog = `
    <div
      class="modal-dialog position-absolute"
      id="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <button
        type="button"
        class="dialog-close"
        id="dialog-close-button"
        aria-label="Close the dialog"
      >
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
      <h2 class="dialog-heading heading-2 text-center" id="dialog-title">
        Are you sure you want to delete this expense?
      </h2>
      <div class="dialog-actions flex-row justify-content-center">
        <button type="button" class="btn btn-secondary" id="cancel-button">
          Cancel
        </button>
        <button type="button" class="btn btn-primary" id="action-button">
          Delete
        </button>
      </div>
    </div>
  `;

  const personalDetailsHTML = `
    <div class="form-control flex-column">
      <label for="first-name">
        First name
      </label>
      <input type="text" id="first-name" name="first-name" required />
    </div>
    <div class="form-control flex-column">
      <label for="second-name">
        Second name
      </label>
      <input type="text" id="second-name" name="second-name" required />
    </div>
    <div class="form-control flex-column">
      <label for="birthday">
        Birthday
      </label>
      <input type="date" id="birthday" name="birthday" max="2021-12-31" lang="en-US" required />
    </div>
    <div class="form-control flex-column">
      <label for="phone-number">
        Phone number (in the format xxx-xxx-xxx)
      </label>
      <input
        type="tel" id="phone-number" name="phone-number" required
        pattern="\\d{3}-\\d{3}-\\d{3}"
        title="Enter your phone number in the format xxx-xxx-xxx"
      />
    </div>
    <div class="form-control flex-column">
      <label for="email">
        Email (in the format &lt;your-username&gt;@pgs-soft.com)
      </label>
      <input
        type="email" id="email" name="email" size="20" required
        pattern=".+@pgs-soft\\.com"
        title="Enter your email in the format <your-username>@pgs-soft.com"
      />
    </div>
    <div class="form-control flex-column">
      <label for="policy-number">
        Policy number
      </label>
      <input type="number" id="policy-number" name="policy-number" min="1" required />
    </div>
    <button type="submit" class="btn btn-primary" id="submit-button">
      Continue
    </button>
  `;

  const incidentDetailsHTML = `
    <fieldset>
      <legend class="text-bold">
        Purpose of Travel
      </legend>
      <div class="form-control">
        <input
          type="radio" id="purpose-choice-1" name="travel-purpose"
          value="tourism"
        />
        <label for="purpose-choice-1" class="radio-label">
          tourism
        </label>
      </div>
      <div class="form-control">
        <input
          type="radio" id="purpose-choice-2" name="travel-purpose"
          value="mental-work"
        />
        <label for="purpose-choice-2" class="radio-label">
          study / mental work
        </label>
      </div>
      <div class="form-control">
        <input
          type="radio" id="purpose-choice-3" name="travel-purpose"
          value="physical-work"
        />
        <label for="purpose-choice-3" class="radio-label">
          physical work
        </label>
      </div>
      <div class="form-control">
        <input
          type="radio" id="purpose-choice-4" name="travel-purpose"
          value="high-risk-sport"
        />
        <label for="purpose-choice-4" class="radio-label">
          high-risk sport
        </label>
      </div>
    </fieldset>
    <div class="form-control flex-column">
      <label for="country">
        Country
      </label>
      <input type="text" id="country" name="country" required />
    </div>
    <div class="form-control flex-column">
      <label for="address">
        Address
      </label>
      <input type="text" id="address" name="address" required />
    </div>
    <div class="form-control flex-column">
      <label for="date">
        Date
      </label>
      <input
        type="date" id="date" name="date"
        min="2022-09-01" lang="en-US" required
      />
    </div>
    <div class="form-control flex-column">
      <label for="description">
        Incident description (length between 30 and 300 characters inclusive)
      </label>
      <textarea
        id="description" name="incident-description"
        minlength="30" maxlength="600"
        rows="15" required
        title="The description should be at least 30 characters long, but not more than 600"></textarea>
    </div>
    <div class="form-buttons flex-column">
      <button type="button" class="btn btn-secondary" id="return-button">
        Return
      </button>
      <button type="submit" class="btn btn-primary" id="submit-button">
        Continue
      </button>
    </div>
  `;

  const expenseReportHTML = `
    <h2 class="heading-2-small" id="heading">
      Expense report
    </h2>
    <div
      class="expense-report-container"
      role="group"
      aria-labelledby="heading"
    >
      <ul class="expense-report-list" id="list-of-expenses"></ul>
    </div>
    <div class="form-buttons flex-column position-relative">
      <button
        type="button"
        class="btn btn-transparent"
        id="add-button"
        aria-haspopup="dialog"
      >
        <i class="fa-solid fa-plus" aria-hidden="true"></i> Add another expense
      </button>
      <button type="button" class="btn btn-secondary" id="return-button">
        Return
      </button>
      <button type="submit" class="btn btn-primary" id="submit-button">
        Submit
      </button>
    </div>
  `;

  const updateInputValuesAndAttachChangeEventListeners = () => {
    const inputFields = document.querySelectorAll(
      '.form-control input, textarea'
    );

    inputFields.forEach((inputField) => {
      const formDataKey = inputField
        .getAttribute('name')
        .split('-')
        .map((value, index) =>
          index < 1 ? value : value[0].toUpperCase() + value.slice(1)
        )
        .join('');

      const typeOfInputField = inputField.getAttribute('type');
      const isOfRadioType = typeOfInputField === 'radio';

      if (isOfRadioType) {
        const isEqualToSavedValue = formData[formDataKey] === inputField.value;
        isEqualToSavedValue && inputField.setAttribute('checked', true);
      } else {
        inputField.value = formData[formDataKey];
      }

      inputField.addEventListener('change', ({ target }) => {
        formData[formDataKey] = target.value;

        if (isOfRadioType) {
          target.setAttribute('checked', true);
        }
      });
    });
  };

  const attachClickEventListenersToButtons = (form, currentStep) => {
    const returnButton = getById('return-button');
    const submitButton = getById('submit-button');

    if (returnButton !== null) {
      returnButton.addEventListener('click', () => renderForm(currentStep - 1));
    }

    submitButton.addEventListener('click', () => {
      const isFormValid = form.reportValidity();

      if (!isFormValid) {
        return;
      }

      renderForm(currentStep + 1);
    });
  };

  const setCurrentStep = (currentStep) => {
    const steps = document.querySelectorAll('.progress-indicator .step');
    steps.forEach((step) => {
      step.removeAttribute('aria-current');
      step.classList.remove('step-current');
    });

    const elementToBeUpdated = steps[currentStep - 1];
    elementToBeUpdated.setAttribute('aria-current', 'step');
    elementToBeUpdated.classList.add('step-current');
  };

  const getRidOfUnnecessaryTextNodes = () => {
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach(
      (item) => item.nextSibling && (item.nextSibling.textContent = '')
    );
  };

  const handleTogglingDisplayOfDialogBoxes = () => {
    const addExpenseButton = getById('add-button');
    const deleteExpenseButtons = document.querySelectorAll(
      '.actions-container button:first-child'
    );
    const editExpenseButtons = document.querySelectorAll(
      '.actions-container button:last-child'
    );

    addExpenseButton.addEventListener('click', () => openDialog());
    deleteExpenseButtons.forEach((button) =>
      button.addEventListener('click', function () {
        const expenseItem = mapClickedButtonToExpenseItem(this);
        const isDeleting = true;
        openDialog(expenseItem, isDeleting);
      })
    );
    editExpenseButtons.forEach((button) =>
      button.addEventListener('click', function () {
        const expenseItem = mapClickedButtonToExpenseItem(this);
        openDialog(expenseItem);
      })
    );
  };

  const openDialog = (expenseItem = null, isDeleting = false) => {
    const body = document.body;
    const modal = getById('modal');
    const expenseItemId = expenseItem && expenseItem.id;

    modal.classList.remove('is-hidden');
    modal.innerHTML =
      expenseItem !== null
        ? isDeleting
          ? deleteConfirmationDialog
          : createAddOrEditExpenseDialog(expenseItem)
        : createAddOrEditExpenseDialog();
    body.classList.add('modal-open');

    const dialog = getById('dialog');
    const dialogForm = getById('dialog-form');
    const dialogCloseButton = getById('dialog-close-button');
    const cancelButton = getById('cancel-button');
    const actionButton = getById('action-button');

    toggleFocusabilityOfItemsOutsideOfDialogBox();

    dialogCloseButton.focus();
    dialog.addEventListener(
      'keydown',
      (keyboardEvent) =>
        keyboardEvent.key === 'Escape' && closeDialog(expenseItemId, isDeleting)
    );
    dialogCloseButton.addEventListener(
      'click',
      closeDialog.bind(null, expenseItemId, isDeleting)
    );
    cancelButton.addEventListener(
      'click',
      closeDialog.bind(null, expenseItemId, isDeleting)
    );
    actionButton.addEventListener('click', (event) => {
      if (!isDeleting) {
        event.preventDefault();
        const isFormValid = dialogForm.reportValidity();

        if (!isFormValid) {
          return;
        }
      }

      expenseItem !== null
        ? isDeleting
          ? deleteExpense(expenseItemId)
          : editExpense(expenseItemId)
        : addNewExpense();
      closeDialog(expenseItemId, isDeleting);
    });
  };

  const closeDialog = (expenseItemId, isDeleting = false) => {
    const body = document.body;
    const modal = getById('modal');

    modal.innerHTML = '';
    modal.classList.add('is-hidden');
    body.classList.remove('modal-open');

    toggleFocusabilityOfItemsOutsideOfDialogBox(true);

    const addExpenseButton = getById('add-button');
    const deleteExpenseButtons = [
      ...document.querySelectorAll('.actions-container button:first-child'),
    ];
    const editExpenseButtons = [
      ...document.querySelectorAll('.actions-container button:last-child'),
    ];

    if (expenseItemId === null) {
      addExpenseButton.focus();
    } else if (isDeleting) {
      const clickedButton = findClickedElement(
        deleteExpenseButtons,
        expenseItemId
      );

      (clickedButton || deleteExpenseButtons[0] || addExpenseButton).focus();
    } else {
      const clickedButton = findClickedElement(
        editExpenseButtons,
        expenseItemId
      );

      clickedButton.focus();
    }
  };

  const findClickedElement = (elements, id) =>
    elements.find((element) => {
      const elementId = element.getAttribute('id');
      const parsedId = +elementId.split('#').reverse()[0];

      return parsedId === id;
    });

  const addNewExpense = () => {
    const newExpenseId = generateRandomId();
    const expenseNameElement = getById('expense-name');
    const expensePriceElement = getById('expense-price');

    const newExpense = {
      id: newExpenseId,
      name: expenseNameElement.value,
      price: +expensePriceElement.value,
    };

    formData.expenses.push(newExpense);
    displayToastMessage(2);
    updateExpenseReportList();
  };

  const editExpense = (expenseItemId) => {
    const expenseIndexToBeUpdated = formData.expenses.findIndex(
      (expense) => expense.id === expenseItemId
    );
    const expenseNameElement = getById('expense-name');
    const expensePriceElement = getById('expense-price');

    formData.expenses[expenseIndexToBeUpdated] = {
      id: formData.expenses[expenseIndexToBeUpdated].id,
      name: expenseNameElement.value,
      price: +expensePriceElement.value,
    };

    displayToastMessage(1);
    updateExpenseReportList();
  };

  const deleteExpense = (expenseItemId) => {
    formData.expenses = formData.expenses.filter(
      (expense) => expense.id !== expenseItemId
    );
    displayToastMessage(0);
    updateExpenseReportList();
  };

  const displayToastMessage = (toastMessageIndex) => {
    const pageWrapper = document.querySelector('.wrapper');
    const isToastAlreadyDisplayed = getById('toast') !== null;

    if (isToastAlreadyDisplayed) {
      pageWrapper.removeChild(pageWrapper.lastElementChild);
    }

    pageWrapper.insertAdjacentHTML(
      'beforeend',
      createToastSuccessMessage(toastMessageIndex)
    );

    const toastCloseButton = getById('toast-close-button');
    toastCloseButton.addEventListener('click', () => {
      const toast = getById('toast');
      pageWrapper.removeChild(toast);
    });
  };

  const updateExpenseReportList = () => {
    const expenseReportList = getById('list-of-expenses');
    expenseReportList.innerHTML = mapExpensesToListItems(formData.expenses);
    getRidOfUnnecessaryTextNodes();
    handleTogglingDisplayOfDialogBoxes();
  };

  const toggleFocusabilityOfItemsOutsideOfDialogBox = (
    shouldBeFocusable = false
  ) => {
    const focusableElementsOutsideOfDialog = document.querySelectorAll(
      '.wrapper a, .wrapper button'
    );
    focusableElementsOutsideOfDialog.forEach((element) =>
      element.setAttribute('tabindex', shouldBeFocusable ? 0 : -1)
    );
  };

  const renderForm = (step = 1) => {
    const claimReportForm = getById('claim-report-form');

    switch (step) {
      case 1:
        claimReportForm.innerHTML = personalDetailsHTML;
        break;
      case 2:
        claimReportForm.innerHTML = incidentDetailsHTML;
        break;
      case 3:
        claimReportForm.innerHTML = expenseReportHTML;
        break;
      default:
        (function (evt) {
          evt.preventDefault();
          submitData();
        })(event);
        return;
    }

    updateInputValuesAndAttachChangeEventListeners();
    attachClickEventListenersToButtons(claimReportForm, step);
    setCurrentStep(step);

    if (step === numberOfSteps) {
      updateExpenseReportList();
    }
  };

  const submitData = () => {
    const body = document.body;
    const spinner = getById('spinner');

    spinner.setAttribute('aria-busy', true);
    spinner.setAttribute('aria-valuenow', 0);
    spinner.classList.remove('is-hidden');
    body.classList.add('is-loading');
    toggleFocusabilityOfItemsOutsideOfDialogBox();

    setTimeout(() => {
      spinner.setAttribute('aria-busy', false);
      spinner.setAttribute('aria-valuenow', 100);
      spinner.classList.add('is-hidden');
      body.classList.remove('is-loading');
      toggleFocusabilityOfItemsOutsideOfDialogBox(true);

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      displayToastMessage(3);
    }, 3000);
  };

  document.body.addEventListener('keydown', (keyboardEvent) => {
    if (keyboardEvent.key !== 'Escape') {
      return;
    }

    const toast = getById('toast');

    if (toast === null) {
      return;
    }

    document.querySelector('.wrapper').removeChild(toast);
  });

  renderForm();
});
