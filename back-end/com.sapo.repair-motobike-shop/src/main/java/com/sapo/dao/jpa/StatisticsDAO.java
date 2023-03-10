package com.sapo.dao.jpa;

import com.sapo.dto.statistics.*;
import com.sapo.entities.Invoice;
import com.sapo.services.impl.UserServiceImpl;
import lombok.val;
import org.apache.poi.ss.formula.functions.T;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Repository(value = "StatisticsDAO")
@Transactional(rollbackOn = Exception.class)
public class StatisticsDAO {
    @Autowired
    protected JdbcTemplate jdbc;
    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    protected NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class.toString());


    //Hàm thống số hóa đơn và tổng tiền
    public List<InvoiceTotalDTO> selecInvoicesTotal(int store_id,int area_id,long dateStart, long dateEnd) {
        String sql = "select\n" +
                "       sum(tbl_invoices.total) as totalPrice,\n" +
                "       count(tbl_invoices.id) as countInvoice\n" +
                "from tbl_invoices\n" +
                "where tbl_invoices.store_id ="+store_id +"\n"+"AND tbl_invoices.area_id="+ area_id +""+" AND tbl_invoices.created_at between \n" + dateStart+
                "\n"+"And\n"+ dateEnd;
        System.out.println(sql);
        Query query = entityManager.createNativeQuery(sql,InvoiceTotalDTO.class);
        System.out.println(sql);
        val xio = ((Object) query.getSingleResult());
        List<InvoiceTotalDTO> statisticsCustomerDTOS = (List<InvoiceTotalDTO>) query.getResultList();
        return statisticsCustomerDTOS;
    }

    public <V> V queryForObject(String query, Object[] args, Class<V> clazz) {
        List<V> result = this.jdbc.query(query, args, new BeanPropertyRowMapper(clazz));
        return result.isEmpty() ? null : result.get(0);
    }
    public Integer getSumInbvoice(int store_id,int area_id,long dateStart, long dateEnd) {
        return jdbc.queryForObject("SELECT  sum(tbl_invoices.total) as totalPrice FROM  tbl_invoices WHERE tbl_invoices.store_id =? and tbl_invoices.area_id = ? and   tbl_invoices.end_at >=? and tbl_invoices.end_at <=? and status=5", new Object[]{store_id,area_id,dateStart,dateEnd}, Integer.class);
    }
    public Integer getCountInbvoice(int store_id,int area_id,long dateStart, long dateEnd) {
        return jdbc.queryForObject("SELECT  count(tbl_invoices.id) as countInvoice FROM  tbl_invoices WHERE tbl_invoices.store_id =? and tbl_invoices.area_id = ? and    tbl_invoices.end_at >=? and tbl_invoices.end_at <=? and status=5", new Object[]{store_id,area_id,dateStart,dateEnd}, Integer.class);
    }
    //Hàm thống số hóa đơn và tổng tiền các hóa đơn của khách hàng
    public List<StatisticsCustomerDTO> selectCustomerAndInvoicesInfo(  long dateStart, long dateEnd) {
        String sql = "select\n" +
                "       tbl_vehicle_customer.customer_id,\n" +
                "       tbl_customers.code,\n" +
                "       tbl_customers.name,\n" +
                "       tbl_customers.phone,\n" +
                "       tbl_vehicles.license_plate,\n" +
                "       tbl_invoices.total as total_purchased,\n" +
                "       count(customer_id) as number_purchases,\n" +
                "       tbl_invoices.created_at\n" +
                "from tbl_invoices, tbl_customers, tbl_vehicles, tbl_vehicle_customer\n" +
                "where tbl_invoices.vehicle_customer_id = tbl_vehicle_customer.id\n" +
                "and tbl_vehicle_customer.customer_id = tbl_customers.id\n" +
                "and tbl_vehicle_customer.vehicle_id = tbl_vehicles.id\n" +
                "and tbl_invoices.end_at>= "+dateStart
                + " and tbl_invoices.end_at<="+dateEnd+
                " group by tbl_vehicle_customer.customer_id";

        System.out.println(sql);
        Query query = entityManager.createNativeQuery(sql);
        List<StatisticsCustomerDTO> statisticsCustomerDTOS = (List<StatisticsCustomerDTO>) query.getResultList();

        return statisticsCustomerDTOS;
    }

    //Hàm thống kê số hóa đơn và tổng tiền các hóa đơn của phụ tùng
    public List<StatisticMaterialDTO> selectMaterialAndInvoiceInfo(long dateStart, long dateEnd) {
        String sql = "select tbl_materials.id,tbl_materials.name,tbl_materials.code\n" +
                "        ,count(tbl_material_order.material_id) as numberInvoices, sum(tbl_material_order.quantity) as numberPurchases,\n" +
                "       (tbl_materials.quantity - sum(tbl_material_order.quantity)) as numberInventory,\n" +
                "       tbl_materials.output_price,\n" +
                "       (tbl_material_order.quantity * tbl_materials.output_price) as totalPurchased, " +
                "       tbl_invoices.created_at\n" +
                "from tbl_invoices, tbl_material_order, tbl_materials\n" +
                "where tbl_invoices.id = tbl_material_order.invoice_id\n" +
                "  and tbl_material_order.material_id = tbl_materials.id\n" +
                "and tbl_invoices.end_at>= "+dateStart
                + " and tbl_invoices.end_at<="+dateEnd+
                " group by tbl_materials.id " +

                " ORDER BY numberPurchases ASC ";
        Query query = entityManager.createNativeQuery(sql);

        List<StatisticMaterialDTO> statisticMaterialDTOS = (List<StatisticMaterialDTO>) query.getResultList();

        return statisticMaterialDTOS;
    }

    //Hàm thống kê số hóa đơn và tổng tiền các hóa đơn của dịch vụ
    public List<StatisticServiceDTO> selectServiveAndInvoiceInfo(int storeId, long dateStart, long dateEnd) {
        String sql = "select tbl_services.id,\n" +
                "       tbl_services.name,\n" +
                "       tbl_services.code,\n" +
                "       tbl_services.price,\n" +
                "       count(tbl_service_order.service_id) as numbersInvoives, " +
                "       (tbl_services.price *  count(tbl_service_order.service_id)) as totalPurchas,\n" +
                "tbl_invoices.created_at\n" +
                "from tbl_services, tbl_service_order, tbl_invoices\n" +
                "where tbl_invoices.id = tbl_service_order.invoice_id\n" +
                " and tbl_invoices.store_id = " + storeId+
                "  and tbl_service_order.service_id = tbl_services.id\n" +
                "and tbl_invoices.end_at>= "+dateStart
                + " and tbl_invoices.end_at<="+dateEnd+
                " group by tbl_services.id " +
                " ORDER BY numbersInvoives ASC ";

        Query query = entityManager.createNativeQuery(sql);

        List<StatisticServiceDTO> statisticServiceDTOS = (List<StatisticServiceDTO>) query.getResultList();

        return statisticServiceDTOS;
    }

    //Hàm thống kê doanh thu
    public List<RevuneDTO> selectRevune() {
        String sql = "select " +
                "tbl_invoices.end_at,\n" +
                "sum(tbl_invoices.total) as totalOuput\n" +
                "from tbl_invoices\n" +
                "group by tbl_invoices.end_at\n";

        Query query = entityManager.createNativeQuery(sql);

        List<RevuneDTO> revuneDTOS = (List<RevuneDTO>) query.getResultList();

        return revuneDTOS;
    }

    //Hàm thống kê doanh thu
    public BigDecimal valueInvoice(int store_id,long dateStart, long dateEnd) {
            return jdbc.queryForObject("SELECT  sum(tbl_invoices.total) as totalPrice FROM  tbl_invoices WHERE tbl_invoices.store_id =?  and   tbl_invoices.end_at >=? and tbl_invoices.end_at <=?", new Object[]{store_id,dateStart,dateEnd}, BigDecimal.class);
        }
    //Hàm thống kê số lượng
    public Integer  countInvoice(int store_id,long dateStart, long dateEnd) {
        return jdbc.queryForObject("SELECT  count(tbl_invoices.id) as countInvoice FROM  tbl_invoices WHERE tbl_invoices.store_id =?  and   tbl_invoices.end_at >=? and tbl_invoices.end_at <=?", new Object[]{store_id,dateStart,dateEnd}, Integer.class);
    }
    //Hàm thống kê số đơn nhập  hàng
    public Integer  countRecipt(int store_id,long dateStart, long dateEnd) {
        return jdbc.queryForObject("SELECT  count(tbl_receipts.id) FROM  tbl_receipts WHERE tbl_receipts.store_id =? and  tbl_receipts.created_at >=? and tbl_receipts.created_at <=?  and tbl_receipts.type = 1", new Object[]{store_id,dateStart,dateEnd}, Integer.class);
    }
    //Hàm thống kê số đơn xuất hàng
    public Integer  countPayment(int store_id,long dateStart, long dateEnd) {
        return jdbc.queryForObject("SELECT  count(tbl_receipts.id) FROM  tbl_receipts WHERE tbl_receipts.store_id =?  and tbl_receipts.created_at >=? and tbl_receipts.created_at <=? and tbl_receipts.type = 2 ", new Object[]{store_id,dateStart,dateEnd}, Integer.class);
    }



    //Hàm thống kê luong nhan vien
    public List<SalaryDTO> selectSalary() {
        String sql = "select tbl_users.id,\n" +
                "       tbl_users.code,\n" +
                "       tbl_users.name,\n" +
                "       tbl_users.salary_day,\n" +
                "       tbl_timesheets.month,\n" +
                "       tbl_timesheets.number_shifts_work,\n" +
                "       tbl_timesheets.number_shifts_late_work,\n" +
                "       (tbl_timesheets.number_shifts_work*tbl_users.salary_day - tbl_timesheets.number_shifts_late_work*50000)as totalSalary\n" +
                "from tbl_users, tbl_timesheets\n" +
                "where tbl_timesheets.user_id = tbl_users.id\n";

        Query query = entityManager.createNativeQuery(sql);

        List<SalaryDTO> salaryDTOS = (List<SalaryDTO>) query.getResultList();

        return salaryDTOS;
    }

    //Hàm thống kê nhap hang (phụ tùng)
    public List<InputMaterialDTO> selectInput() {
        String sql = "select\n" +
                "       tbl_materials.id,\n" +
                "       tbl_materials.code,\n" +
                "       tbl_materials.name,\n" +
                "       tbl_materials.input_price,\n" +
                "       tbl_receipt_material.quantity,\n" +
                "       tbl_receipt_material.quantity*tbl_materials.input_price as totalMoney,\n" +
                "       tbl_receipts.created_at\n" +
                "from tbl_receipts,tbl_receipt_material, tbl_materials\n" +
                "where tbl_receipts.id = tbl_receipt_material.receipt_id\n" +
                "and tbl_receipt_material.material_id = tbl_materials.id\n";

        Query query = entityManager.createNativeQuery(sql);

        List<InputMaterialDTO> inputMaterialDTOS = (List<InputMaterialDTO>) query.getResultList();

        return inputMaterialDTOS;
    }


    public  List<Invoice> findAllInvoiceByDate(int storeId,long dateStart, long dateEnd){
        String sql = "SELECT * FROM tbl_invoices " +
                " Where tbl_invoices.store_id= "+ storeId+ " AND  tbl_invoices.end_at >= " + dateStart +
                " AND tbl_invoices.end_at <= " + dateEnd;
        System.out.println(sql);
        Query query = entityManager.createNativeQuery(sql, Invoice.class);
        return query.getResultList();
    }





}
