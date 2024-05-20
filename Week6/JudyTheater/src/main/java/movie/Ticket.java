package movie;

public class Ticket {
    private Movie movie;
    private Theater theater;
    private Schedule schedule;
    private Seat seat;
    private int price;
    private int discount;

    public Ticket(Movie movie, Theater theater, Schedule schedule, Seat seat, int price, int discount) {
        this.movie = movie;
        this.theater = theater;
        this.schedule = schedule;
        this.seat = seat;
        this.price = price;
        this.discount = discount;
    }

    public int getPrice() {
        return price;
    }

    public int getDiscount() {
        return discount;
    }
}
