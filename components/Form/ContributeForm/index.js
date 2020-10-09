import {ErrorMessage, Formik, Form} from "formik";
import {useRouter} from "next/router";
import {useState} from "react";
import {Button, Grid, Input, Message} from "semantic-ui-react";
import campaignAbi from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import useAccounts from "../../../hooks/useAccounts";
import * as Yup from "yup";
import Field from "./field";

const ContributeForm = ({address}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const accounts = useAccounts();
  const router = useRouter();

  const onSubmit = async ({amount}) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const campaign = campaignAbi(address);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(String(amount), "ether"),
      });
      router.reload();
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {amount: ""};
  const SignupSchema = Yup.object().shape({
    amount: Yup.number()
      .required("${path} is required")
      .moreThan(0, "${path} must be a positive number"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      onSubmit={onSubmit}
    >
      <Form>
        <h3>Amount to contribute</h3>

        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Field name="amount" labelPosition="right" label="amount" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <Button loading={loading} primary type="submit">
                submit
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <div style={{minHeight: 100}}>
                {errorMessage && (
                  <Message error visible={errorMessage}>
                    <Message.Header>Oops</Message.Header>
                    <p>{errorMessage}</p>
                  </Message>
                )}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </Formik>
  );
};

export default ContributeForm;
