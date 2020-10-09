import {useField} from "formik";
import {Input} from "semantic-ui-react";

const Field = ({label, type, ...props}) => {
  const [field, meta, helpers] = useField(props);

  return (
    <div>
      <Input label={label} type={type} {...field} {...props} />
      <div style={{minHeight: 20, color: "red"}}>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    </div>
  );
};

export default Field;
