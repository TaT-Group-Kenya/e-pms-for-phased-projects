import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import PaymentReceivingMethodsTable from "../../../components/finance/PaymentReceivingMethods/PaymentReceivingMethodsTable";
import React from "react";

const PaymentReceivingMethodsPage: React.FC = () => {
    return (
        <>
        <AuthenticatedLayout>
            <PaymentReceivingMethodsTable />
        </AuthenticatedLayout>
        </>
    )
};

export default PaymentReceivingMethodsPage;
