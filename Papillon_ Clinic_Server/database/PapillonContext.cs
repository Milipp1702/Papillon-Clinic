using Microsoft.EntityFrameworkCore;

namespace papillon_clinic_server.database {
    public class PapillonContext : DbContext {
        public PapillonContext(DbContextOptions<PapillonContext> options) : base(options) {}
    }
}