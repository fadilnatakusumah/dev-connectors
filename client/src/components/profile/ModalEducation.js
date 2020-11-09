import { Button, Header, Image, Modal, Input, TextArea, Checkbox, Form } from 'semantic-ui-react'
import { useState } from 'react';
import { connect } from 'react-redux';
import { addEducation } from '../../store/actions/profileAction';

function ModalExperience({ open, setModal, addEducation, children }) {
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

    addEducation(form)
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
      <Modal.Header>Add Education</Modal.Header>
      <Modal.Content>
        <Form loading={isLoading}>
          {/* school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description, */}
          <Form.Field
            required
            name='school'
            control={Input}
            value={form.school || ''}
            label='School'
            placeholder='What school did you went.'
            onChange={onChange}
            error={errors.school ? errors.school : null}
          />
          <Form.Field
            required
            name='degree'
            control={Input}
            value={form.degree || ''}
            label='Degree'
            placeholder='The degree you got from the school.'
            onChange={onChange}
            error={errors.degree ? errors.degree : null}
          />
          <Form.Field
            name='fieldofstudy'
            control={Input}
            value={form.fieldofstudy || ''}
            label='Field of Study'
            placeholder='Field of study that you did.'
            onChange={onChange}
            error={errors.fieldofstudy ? errors.fieldofstudy : null}
          />
          <Form.Field
            name='description'
            control={TextArea}
            value={form.description || ''}
            label='Description'
            placeholder='Description of your field of study.'
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
            label='Are you still learning in this school?'
            onChange={onChange}
            error={errors.current ? errors.current : null}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          disabled={isLoading}
          content={`${isLoading ? "Loading" : "Submit"}`}
          onClick={onSubmit}
          primary
        />
      </Modal.Actions>
    </Modal>
  )
}


export default connect(null, { addEducation })(ModalExperience)
