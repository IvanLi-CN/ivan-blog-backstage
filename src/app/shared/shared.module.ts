import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OperationButtonComponent} from './operation-button/operation-button.component';
import {OperationsComponent} from './operations/operations.component';
import {TableOperationButtonComponent} from './table-operation-button/table-operation-button.component';
import {TableOperationTextInputModalComponent} from './table-operation-text-input-modal/table-operation-text-input-modal.component';
import {TableOperationsComponent} from './table-operations/table-operations.component';
import {TextInputModalComponent} from './text-input-modal/text-input-modal.component';
import {CoreModule} from '../core/core.module';
import {MomentModule} from 'ngx-moment';
import {TableImagePreviewComponent} from './table-image-preview/table-image-preview.component';
import {SmallImagePreviewComponent} from './small-image-preview/small-image-preview.component';
import {EnumPreviewComponent} from './enum-perview/enum-preview.component';
import {ImageUploaderComponent} from './image-uploader/image-uploader.component';
import {TooltipAmountComponent} from './tooltip-amount/tooltip-amount.component';
import {PlatformSelectorComponent} from './platform-selector/platform-selector.component';
import {UserSelectorComponent} from './user-selector/user-selector.component';
import {Nav2pageDirective} from './nav2page.directive';
import {UpOrDownIndicatorComponent} from './up-or-down-indicator/up-or-down-indicator.component';
import {SimpleSearchMemberListComponent} from './simple-search-member-list/simple-search-member-list.component';
import {RouterModule} from '@angular/router';
import {OperatorComponent} from './operator/operator.component';
import {UploadImagePopoverComponent} from './upload-image-popover/upload-image-popover.component';
import {TableRemarkViewComponent} from './table-remark-view/table-remark-view.component';
import {AccountSelectorComponent} from './account-selector/account-selector.component';
import {UserIdsSelectorComponent} from './user-ids-selector/user-ids-selector.component';
// 第三方模块
const THIRDMODULES = [
];

// 自定义组件
const COMPONENT = [
  OperationButtonComponent,
  OperationsComponent,
  TableOperationButtonComponent,
  TableOperationTextInputModalComponent,
  TableOperationsComponent,
  TextInputModalComponent,
  TableImagePreviewComponent,
  SmallImagePreviewComponent,
  EnumPreviewComponent,
  ImageUploaderComponent,
  TooltipAmountComponent,
  PlatformSelectorComponent,
  UserSelectorComponent,
  UpOrDownIndicatorComponent,
  SimpleSearchMemberListComponent,
  OperatorComponent,
  UploadImagePopoverComponent,
  TableRemarkViewComponent,
  AccountSelectorComponent,
  UserIdsSelectorComponent,
];

// 自定义管道
const PIPES = [

];

// 自定义指令
const DIRECTIVE = [
  Nav2pageDirective,
];


@NgModule({
  declarations: [
    ...COMPONENT,
    ...PIPES,
    ...DIRECTIVE,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MomentModule,
    ...THIRDMODULES,
    RouterModule,
  ],
  exports: [
    CoreModule,
    MomentModule,
    ...THIRDMODULES,
    ...COMPONENT,
    ...PIPES,
    Nav2pageDirective,
  ]
})
export class SharedModule { }
