export class CreateLeadDto {
  userName!: string;
  companyName!: string;
  contactNumber!: string;
  email!: string;
  stageId!: string;
  firstContactedDate!: string;
  lastContactedDate!: string;
  comments?: string;
}
