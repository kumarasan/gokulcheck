import Validator from "./Validator";
import Utility from "./Utility";
import _ from "lodash";

class Form {
  /**
   * Get instance for utitlity
   *
   * @param object
   * @param object
   * @param callback
   * @param callback
   * @return object
   */
  static getInstance(
    currentComponent,
    rules,
    afterSubmit,
    afterFileSelect,
    fileRules
  ) {
    return new Form(
      currentComponent,
      rules,
      afterSubmit,
      afterFileSelect,
      fileRules
    );
  }
  /**
   * Class initializer
   *
   * @param object
   * @param object
   * @param callback
   * @param callback
   * @return void
   */
  constructor(
    currentComponent,
    rules,
    afterSubmit,
    afterFileSelect,
    fileRules
  ) {
    this.validator = Object.assign({}, Validator);
    this.validator.setComponent(currentComponent).setRules(rules);
    this.currentComponent = currentComponent;
    this.afterSubmit = afterSubmit;
    this.afterFileSelect = afterFileSelect;
    this.fileRules = fileRules;
    this.rules = rules;
  }

  /**
   * Handle to update the form rules
   *
   * @param object
   * @return void
   */
  updateRules(rules) {
    if (Utility.isObject(rules) && rules) {
      this.rules = rules;
    }
  }

  /**
   * Handle to update the form input fields state
   *
   * @param mixed | name
   * @param mixed | value
   * @param mixed | callback
   */
  updateFormFieldsState = (name, value, callback = () => {}) => {
    if (this.currentComponent && name) {
      let fields = JSON.parse(
        JSON.stringify(
          this.currentComponent.state.fields ||
            this.currentComponent.state.filters
        )
      );

      fields = _.set(fields, name, value);
      this.currentComponent.setState(
        {
          fields: fields,
          filters: fields
        },
        callback
      );
    }
  };

  /**
   * Handle field changes
   *
   * @param object
   * @return void
   */
  handleFieldsChange = e => {
    const name =
      e.target.dataset && e.target.dataset.hasOwnProperty("name")
        ? e.target.dataset.name
        : e.target.name;
    let value = e.target.value;

    // radio button boolean value we always receive as string
    // So here we convert type of true & false value from string to boolean
    // e.target.type === "radio" ||
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    this.updateFormFieldsState(name, value);
  };

  handleSelectFieldChange = name => value => {
    this.updateFormFieldsState(name, value);
  };

  /**
   * handle date change update date in milliseconds
   * @paran name
   */
  handleDateChange = (name, date, callback) => {
    // Convert to milliseconds
    const timestamp = new Date(date).valueOf();
    this.updateFormFieldsState(name, timestamp, callback);
  };

  /**
   * handle date change update time in milliseconds
   * @paran name
   */
  handleDateandTimeChange = (name, datetime) => {
    // Convert to milliseconds
    const timestamp = new Date(datetime).valueOf();
    this.updateFormFieldsState(name, timestamp);
  };

  /**
   * Get file rule by element name handleed
   *
   * @param name
   * @return mixed
   */
  getFileRuleByElementName(name) {
    return Utility.isObject(this.fileRules) &&
      name &&
      this.fileRules.hasOwnProperty(name)
      ? this.fileRules[name]
      : false;
  }

  /**
   * Handle file select
   *
   * @param object
   * @return void
   */
  handleFileSelect = e => {
    e.preventDefault();
    let fileList = e.target.files || e.dataTransfer.files;
    if (fileList && fileList.length > 0) {
      let file = fileList[0];
      file.fileName = e.target.name;
      this.processFile(file, this.getFileRuleByElementName(e.target.name));
      this.cleanFileElement(e.target);
    }
  };

  blurEventListner = e => {
    this.validator
      .setComponent(this.currentComponent)
      .setRules(this.rules)
      .blurEventListner(e);
  };

  /**
   * Clean the file dom
   * @return void
   */
  cleanFileElement(file) {
    try {
      file.value = null;
    } catch (ex) {}

    if (file.value) {
      file.parentNode.replaceChild(file.cloneNode(true), file);
    }
  }

  /**
   * Process the selected file
   *
   * @param object file
   * @param object rules
   * @return void
   */
  processFile(file, rules) {
    let errors = this.validateFile(file, rules);

    if (errors.length === 0) {
      if (this.isImage(file)) {
        this.loadImage(file);
      }

      if (this.afterFileSelect) {
        this.afterFileSelect(file);
      }
    } else {
      alert(errors.shift(errors), "", {
        timeOut: 3000
      });
    }
  }

  /**
   * Validate the image file selected
   *
   * @param object file
   * @return object
   */
  validateImageFile(file, rules) {
    let errors = [];

    /**
     * Valid file size selected
     * @rule fileSize
     */
    if (rules.fileSize && file.size > rules.fileSize) {
      errors.push(
        `File size should not be greater than ${rules.fileSize /
          (1024 * 1024)} MB`
      );
    }

    /**
     * Valid selected mime type
     * @rule mime
     */
    if (
      rules.mime &&
      rules.mime.indexOf(file.type.replace(/image\//g, "")) === -1
    ) {
      errors.push(
        "Invalid file uploaded ,Please make sure you select a file with " +
          rules.mime.join(",")
      );
    }

    return errors;
  }

  /**
   * Validate the file selected
   *
   * @param object file
   * @return object
   */
  validateFile(file, rules) {
    let errors = [];

    /**
     * Valid file size selected
     * @rule fileSize
     */
    if (rules.fileSize && file.size > rules.fileSize) {
      errors.push(
        `File size should not be greater than ${rules.fileSize /
          (1024 * 1024)} MB`
      );
    }

    /**
     * Check for file Type
     * extract the type of file from name when it is empty in file object
     */
    let fileType = file.type;
    if (fileType === "" || fileType === undefined) {
      fileType = file.name.split(".").pop();
    }

    /**
     * Valid selected mime type
     * @rule mime
     */
    if (
      rules.mime &&
      fileType.length > 0 &&
      (fileType.search(rules.mime[0]) === -1 &&
        rules.mime.indexOf(fileType.substring(fileType.indexOf("/") + 1)) ===
          -1)
    ) {
      errors.push(
        "Invalid file uploaded ,Please make sure you select a file with " +
          rules.mime.join(",") +
          " extension"
      );
    }

    return errors;
  }

  /**
   * Load selected image file with fileReader
   *
   * @param object file
   * @return void
   */
  loadImage(file) {
    let reader = new FileReader();

    reader.onload = e => {
      file.src = e.target.result;

      if (this.afterFileSelect) {
        this.afterFileSelect(file);
      }
    };

    reader.readAsDataURL(file);
  }

  /**
   * Handle form submit
   *
   * @param object
   * @return void
   */
  handleSubmit = e => {
    e.preventDefault();
    //if(Validator.validateReactForm(e.target) && this.afterSubmit){
    if (
      Validator.setComponent(this.currentComponent)
        .setRules(this.rules)
        .validateReactForm(e.target) &&
      this.afterSubmit
    ) {
      this.afterSubmit(
        this.currentComponent.state.fields ||
          this.currentComponent.state.filters
      );
    }
  };
  /**
   * check selected file is a image
   *
   * @param object file
   * @return boolean
   */
  isImage(file) {
    return (
      Utility.isObject(file) &&
      typeof file.hasOwnProperty("type") &&
      [
        "image/png",
        "image/gif",
        "image/bmp",
        "image/jpg",
        "image/jpeg"
      ].indexOf(file.type) > -1
    );
  }
}

export default Form;

/**
 * Function to display the input errors
 * @param {*} object
 */
export const displayError = object => {
  return object && object.has && object.message;
};

/**
 * Function to get the serer error
 * @param {*} response
 * @param {*} defaultMsg
 */
export const getServerError = (response, defaultMsg) => {
  // set a default message
  defaultMsg = defaultMsg || "Something went wrong.";
  //return errors
  return response.errors && response.errors.message
    ? response.errors.message
    : _.isObject(response.errors)
    ? generateFieldErrors(response.errors)
    : defaultMsg;
};

/**
 * Generate error fields
 * @param {*} errors
 */
const generateFieldErrors = errors => {
  let inputErrors = {};
  for (let key in errors) {
    // check key is available
    if (errors.hasOwnProperty(key) && key !== "message") {
      inputErrors[key] = {
        has: true,
        message: errors[key]
      };
    }
  }
  return inputErrors;
};
