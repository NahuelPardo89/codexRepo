import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaymentMethod } from 'src/app/Models/appointments/paymentmethod.interface';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { PaymentmethodService } from 'src/app/Services/paymentmethod/paymentmethod.service';

@Component({
  selector: 'app-payment-method-list',
  templateUrl: './payment-method-list.component.html',
  styleUrls: ['./payment-method-list.component.css'],
})
export class PaymentMethodListComponent {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource!: MatTableDataSource<PaymentMethod>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private paymentService: PaymentmethodService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setDataTable();
  }

  setDataTable() {
    this.paymentService.getPaymentMethods().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.paginator._intl.itemsPerPageLabel = 'items por página';
      this.paginator._intl.firstPageLabel = 'primera página';
      this.paginator._intl.lastPageLabel = 'última página';
      this.paginator._intl.nextPageLabel = 'página siguiente';
      this.paginator._intl.previousPageLabel = 'página anterior';

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editPayment(payment: PaymentMethod) {
    this.router.navigate(['Dashboard/reports/payment-method/edit'], {
      state: { payment },
    });
  }

  deletePayment(id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Estás seguro de que deseas elminar este metodo de pago?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        this.paymentService.deletePaymentMethod(id).subscribe({
          next: () => {
            this.setDataTable();
            this.dialogService.showSuccessDialog(
              'Metodo de pago eliminado con éxito'
            );
          },
          error: (error) => {
            this.dialogService.showErrorDialog(
              'Hubo un error al eliminar el metodo de pago'
            );
          },
        });
      }
    });
  }
}
