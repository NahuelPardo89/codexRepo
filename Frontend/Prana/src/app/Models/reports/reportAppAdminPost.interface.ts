export interface ReportAppAdminPostInterface {
    start_date: string;
    end_date: string;
    doctor?: number,
    patient?: number,
    health_insurance?: number,
    specialty?: number,
    branch?: number,
    payment_method?: number
}