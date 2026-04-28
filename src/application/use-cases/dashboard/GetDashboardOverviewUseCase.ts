import { DashboardRepository } from "../../../domain/repositories/DashboardRepository";

export class GetDashboardOverviewUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) { }

  async execute(input: { range: "7d" | "30d" | "custom"; startDate: Date; endDate: Date }) {
    return this.dashboardRepository.getOverview(input);
  }
}
