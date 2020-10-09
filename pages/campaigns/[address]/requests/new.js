import {Form, Formik} from "formik";
import {useRouter} from "next/router";
import {useState} from "react";
import {Button, Message} from "semantic-ui-react";
import * as Yup from "yup";
import Field from "../../../../components/Form/ContributeForm/field";
import Layout from "../../../../components/layout";
import campaignAbi from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import useAccounts from "../../../../hooks/useAccounts";

const RequestIndex = ({address, requests, requestsCount}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const accounts = useAccounts();
  const router = useRouter();

  const onSubmit = async ({value, description, recipient}) => {
    console.log("value, description, recipient", value, description, recipient);
    setLoading(true);
    setErrorMessage("");

    try {
      const campaign = campaignAbi(address);
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(String(value), "ether"),
          recipient
        )
        .send({from: accounts[0]});
      router.reload();
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const SignupSchema = Yup.object().shape({
    value: Yup.number()
      .required("${path} is required")
      .moreThan(0, "${path} must be a positive number"),
    description: Yup.string().required(),
    recipient: Yup.string().required(),
  });

  const initialValues = {
    description: "",
    value: 0,
    recipient: "",
  };

  return (
    <Layout>
      <h3>Create a new Request for {address} </h3>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <Field name="description" labelPosition="right" label="description" />
          <Field
            type="number"
            name="value"
            labelPosition="right"
            label="ether"
          />
          <Field name="recipient" labelPosition="right" label="recipient" />
          <Button loading={loading} primary type="submit">
            create !
          </Button>
          <div style={{minHeight: 100}}>
            {errorMessage && (
              <Message error visible={errorMessage}>
                <Message.Header>Oops</Message.Header>
                <p>{errorMessage}</p>
              </Message>
            )}
          </div>
        </Form>
      </Formik>
    </Layout>
  );
};

export default RequestIndex;

export const getServerSideProps = async (props) => {
  const {address} = props.query;

  return {
    props: {
      address,
    },
  };
};
