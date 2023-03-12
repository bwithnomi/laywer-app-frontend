const rules = {
  required: (val: any) => !!val || 'Field is required',
  email: (val: string) => {
    if (val) {
      return val.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g) ? true :  'Invalid email pattern'
    }

    return true;
  }
}

export default rules;