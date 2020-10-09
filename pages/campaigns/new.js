import {Form, Formik} from "formik";
import {useRouter} from "next/router";
import {useState} from "react";
import {Button, Message} from "semantic-ui-react";
import Layout from "../../components/layout";
import factory from "../../ethereum/factory";
import useAccounts from "../../hooks/useAccounts";
import * as Yup from "yup";
import Field from "../../components/Form/ContributeForm/field";
import web3 from "../../ethereum/web3";

const SignupSchema = Yup.object().shape({
  minimumAmount: Yup.number()
    .required("${path} is required")
    .moreThan(0, "${path} must be a positive number"),
});

const initialValues = {
  minimumAmount: 0,
};

const CampaignNew = () => {
  const accounts = useAccounts();
  const [loading, setLoading] = useState(false);
  // handle form submition here. note that this is only for the submition. field's error are handle by react-hooks-form
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onSubmit = async ({minimumAmount}) => {
    setLoading(true);
    setErrorMessage("");

    try {
      await factory.methods
        .createCampaign(web3.utils.toWei(String(minimumAmount), "ether"))
        .send({from: accounts[0]});
      router.push("/");
    } catch (e) {
      setErrorMessage(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div>
        <h3>New Campaign</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <Field
              type="number"
              name="minimumAmount"
              labelPosition="right"
              label="ether"
            />
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
      </div>
    </Layout>
  );
};

export default CampaignNew;
