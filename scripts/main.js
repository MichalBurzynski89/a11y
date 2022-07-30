const getById = (id) => document.getElementById(id);

window.addEventListener('DOMContentLoaded', () => {
  const formData = {
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
      { name: 'very very very very very expensive item', price: 1000000 },
      { name: 'not so much expensive item', price: 10000 },
      { name: 'cheap item', price: 100 },
      { name: 'just an item', price: 10 },
      { name: 'item', price: 1 },
    ],
  };

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

  const renderForm = (step = 1) => {
    const claimReportForm = getById('claim-report-form');

    switch (step) {
      case 1:
        claimReportForm.innerHTML = personalDetailsHTML;
        break;
      case 2:
        claimReportForm.innerHTML = incidentDetailsHTML;
        break;
      default:
        event.preventDefault();
        return;
    }

    updateInputValuesAndAttachChangeEventListeners();
    attachClickEventListenersToButtons(claimReportForm, step);
    setCurrentStep(step);
  };

  renderForm();
});
