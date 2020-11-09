import { Button, Header, Image, Modal, Input, TextArea, Checkbox, Form } from 'semantic-ui-react'
import { useState } from 'react';
import { connect } from 'react-redux';
import { addExperience } from '../../store/actions/profileAction';

function ModalExperience({ open, setModal, addExperience, children }) {
  const [isLoading, setLoading] = useState(false)
  const [state, setState] = useState({
    form: {},
    errors: {}
  });
  const { form, errors } = state;

  const clearForm = () => setState({ form: {}, errors: {} })

  const onChange = (e, { name, checked }) => {
    if (name === "current") {
      return setState(prevState => ({
        ...prevState, form: {
          ...prevState.form,
          [name]: checked
        },
        errors: {
          ...prevState.errors,
          [name]: undefined,
        }
      }))
    }
    setState(prevState => ({
      ...prevState, form: {
        ...prevState.form,
        [e.target.name]: e.target.value
      },
      errors: {
        ...prevState.errors,
        [e.target.name]: undefined,
      }
    }))
  }

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    setState(prevState => ({ ...prevState, errors: {} }))

    addExperience(form)
      .then(() => {
        setLoading(false);
        clearForm();
        setModal(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err && err.errors && err.errors.length > 0) {
          const { errors } = err;
          errors.map(({ msg, param }) => errors[param] = msg);
          setState(prevState => ({ ...prevState, errors }))
        }
      })
  }


  return (
    <Modal
      onClose={() => setModal(false)}
      onOpen={() => setModal(true)}
      open={open}
      trigger={children}
    >
      <Modal.Header>Add Experience</Modal.Header>
      <Modal.Content>
        <Form loading={isLoading}>
          <Form.Field
            required
            name='title'
            control={Input}
            value={form.title || ''}
            label='Title'
            placeholder='Title of your job.'
            onChange={onChange}
            error={errors.title ? errors.title : null}
          />
          <Form.Field
            required
            name='company'
            control={Input}
            value={form.company || ''}
            label='Company'
            placeholder='Name of the company.'
            onChange={onChange}
            error={errors.company ? errors.company : null}
          />
          <Form.Field
            name='location'
            control={Input}
            value={form.location || ''}
            label='Location'
            placeholder='Location of your job.'
            onChange={onChange}
            error={errors.location ? errors.location : null}
          />
          <Form.Field
            name='description'
            control={TextArea}
            value={form.description || ''}
            label='Description'
            placeholder='Description of your job.'
            onChange={onChange}
            error={errors.description ? errors.description : null}
          />
          <Form.Field
            required
            name='from'
            control={Input}
            type="date"
            value={form.from || ''}
            label='From Date'
            placeholder='Date of the job started.'
            onChange={onChange}
            error={errors.from ? errors.from : null}
          />
          <Form.Field
            name='to'
            control={Input}
            type="date"
            value={form.to || ''}
            label='From Date'
            placeholder='Date of the job ended.'
            onChange={onChange}
            error={errors.to ? errors.to : null}
          />
          <Form.Field
            name='current'
            control={Checkbox}
            checked={form.current || false}
            label='Is this your current job?'
            onChange={onChange}
            error={errors.current ? errors.current : null}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Submit"
          onClick={onSubmit}
          primary
        />
      </Modal.Actions>
    </Modal>
  )
}


export default connect(null, { addExperience })(ModalExperience)
