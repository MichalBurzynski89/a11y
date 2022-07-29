const getById = (id) => document.getElementById(id);

window.addEventListener('DOMContentLoaded', () => {
  const personalDetailsHtml = `
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
      <input type="date" id="birthday" name="birthday" lang="en-US" required />
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

  const claimReportForm = getById('claim-report-form');
  claimReportForm.innerHTML = personalDetailsHtml;
});
